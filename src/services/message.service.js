import MessageRepository from "../repositories/message.repository.js"
import ChatRepository from "../repositories/chat.repository.js"
import ContactRepository from "../repositories/contact.repository.js"
import ServerError from "../utils/customError.utils.js"

class MessageService {
    static async createMessage({ requesterUserId, contactId, peerUserId, chatId, content }) {
        if (!requesterUserId) {
            throw new ServerError(401, "No autenticado")
        }
        if (!content?.trim()) {
            throw new ServerError(400, "Mensaje vacío")
        }
        if (chatId) {
            // Crear el mensaje dentro de ese chat ya existente
            const msg = await MessageRepository.create({
                chatId,
                sender: requesterUserId,
                content: content.trim(),
            })
            // Actualizar lastMessage
            await ChatRepository.setLastMessage(chatId, msg._id)
            return msg
        }
        let contact_user_id = null
        if (peerUserId) {
            contact_user_id = peerUserId
        } else if (contactId) {
            const contactDoc = await ContactRepository.getById(contactId)
            if (!contactDoc) {
                throw new ServerError(404, "Contacto no encontrado")
            }
            contact_user_id = contactDoc.contact_user_id
        } else {
            throw new ServerError(400, "Falta contactId o peerUserId")
        }
        // Crear o encontrar el chat 1:1
        const chat = await ChatRepository.createPair(requesterUserId, contact_user_id)
        const msg = await MessageRepository.create({
            chatId: chat._id,
            sender: requesterUserId,
            content: content.trim(),
        })
        // Actualizar lastMessage
        await ChatRepository.setLastMessage(chat._id, msg._id)
        return msg
    }


    static async getMessages(chatId) {
        return MessageRepository.getByChatId(chatId)
    }

    static async deleteMessage({ messageId, userId }) {
        const message = await MessageRepository.findById(messageId)
        if (!message) {
            throw new ServerError(404, "Mensaje no encontrado")
        }
        if (message.sender.toString() !== userId.toString()) {
            throw new ServerError(403, "No autorizado para borrar este mensaje")
        }
        const chatId = message.chatId
        // === SOFT DELETE ===
        if (!message.deletedAt) {
            const updated = await MessageRepository.softDelete(messageId, userId)
            await ChatRepository.setLastMessage(chatId, updated._id)
            return { ok: true, softDeleted: true, messageId, chatId }
        }
        // === HARD DELETE ===
        await MessageRepository.hardDelete(messageId)
        // buscar el mensaje anterior
        await ChatRepository.updateLastMessageAfterChange(chatId)
        return { ok: true, hardDeleted: true, messageId, chatId }
    }

    static async markDelivered(messageId) {
        const msg = await MessageRepository.updateStatus(messageId, "delivered")
        if (!msg) throw new ServerError(404, "Mensaje no encontrado")
        return msg
    }

    static async markRead(messageId) {
        const msg = await MessageRepository.updateStatus(messageId, "read")
        if (!msg) throw new ServerError(404, "Mensaje no encontrado")
        return msg
    }


    static searchMessages(chatId, query) {
        return MessageRepository.searchInChat(chatId, query)
    }
}

export default MessageService
