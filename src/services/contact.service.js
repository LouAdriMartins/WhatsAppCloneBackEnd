import ContactRepository from "../repositories/contact.repository.js"
import UserRepository from "../repositories/user.repository.js"
import ChatRepository from "../repositories/chat.repository.js"
import MessageRepository from "../repositories/message.repository.js"
import ServerError from "../utils/customError.utils.js"
class ContactService {
    static async createContact({ owner_user_id, name, contact_email, phone_number }) {
        if (!owner_user_id || !name?.trim() || !contact_email?.trim()) {
            throw new ServerError(400, "Faltan datos obligatorios (owner_user_id, name, contact_email)")
        }
        const email = contact_email.trim().toLowerCase()
        // buscar usuario real por email
        const user = await UserRepository.getByEmail(email)
        if (!user) {
            throw new ServerError(404, "No existe un usuario registrado con ese email")
        }
        // evitar que se agregue a si mismo
        if (user._id.toString() === owner_user_id.toString()) {
            throw new ServerError(400, "No puedes agregarte a ti mismo como contacto")
        }
        // evitar duplicados
        const dup1 = await ContactRepository.findByOwnerAndContactUser(owner_user_id, user._id)
        if (dup1) {
            throw new ServerError(409, "Ese usuario ya está en tu lista de contactos")
        }
        const dup2 = await ContactRepository.findByOwnerAndEmail(owner_user_id, email)
        if (dup2) {
            throw new ServerError(409, "Ya tenés un contacto con ese email")
        }
        const newContact = await ContactRepository.createContact({
            owner_user_id,
            contact_user_id: user._id,
            contact_email: email,
            name: name.trim(),
            phone_number: phone_number?.trim() || null,
            profile_image_url: user.profile_image_url || null,
            last_synced_at: new Date(),
        })
        return newContact
    }

    static async getContactsByUser(owner_user_id, searchTerm = "") {
        if (!owner_user_id) {
            throw new ServerError(400, "Falta owner_user_id")
        }
        return searchTerm?.trim()
            ? ContactRepository.searchContacts(owner_user_id, searchTerm)
            : ContactRepository.getContactsByUser(owner_user_id)
    }

    static async getContactById(contact_id) {
        const contact = await ContactRepository.getById(contact_id)
        if (!contact) {
            throw new ServerError(404, "Contacto no encontrado")
        }
        return contact
    }

    static async updateContact(contact_id, data) {
        // Seguridad: NO permitir cambiar identidad
        const { contact_email, contact_user_id, owner_user_id, ...rest } = data || {}
        const updated = await ContactRepository.updateById(contact_id, rest)
        if (!updated) {
            throw new ServerError(404, "No se pudo actualizar el contacto")
        }
        return updated
    }

    static async deleteContact(contact_id) {
        const ok = await ContactRepository.deleteById(contact_id)
        if (!ok) {
            throw new ServerError(404, "No se encontró el contacto para eliminar")
        }
        return { message: "Contacto eliminado correctamente" }
    }

    static async getFavorites(owner_user_id) {
        return ContactRepository.getFavorites(owner_user_id)
    }

    static async toggleBlock(contact_id, is_blocked) {
        const updated = await ContactRepository.toggleBlock(contact_id, is_blocked)
        if (!updated) {
            throw new ServerError(404, "No se pudo actualizar el estado de bloqueo")
        }
        return updated
    }

    // Manejo de lista de contactos en pantalla principal
    static async getContactsByUser(owner_user_id, searchTerm = "") {
        if (!owner_user_id) {
            throw new ServerError(400, "Falta owner_user_id")
        }
        // obtener contactos base
        const baseContacts = searchTerm?.trim()
            ? await ContactRepository.searchContacts(owner_user_id, searchTerm)
            : await ContactRepository.getContactsByUser(owner_user_id)
        const enriched = await Promise.all(
            baseContacts.map(async (c) => {
                const chat = await ChatRepository.findChatBetween(
                    owner_user_id,
                    c.contact_user_id
                )
                let unreadCount = 0
                let lastMessage = null
                let chatId = null
                if (chat) {
                    chatId = chat._id
                    lastMessage = chat.lastMessage
                        ? {
                            text: chat.lastMessage.content,
                            status: chat.lastMessage.status,
                            createdAt: chat.lastMessage.createdAt
                        }
                        : null
                    if (chat.lastMessage) {
                        unreadCount = await MessageRepository.countUnread(chat._id, owner_user_id)
                    }
                }
                return {
                    _id: c._id,
                    name: c.name,
                    profile_image_url: c.profile_image_url ?? null,
                    lastMessage,
                    unread_messages: unreadCount,
                    is_archived: false,
                    chatId,
                    contact_user_id: c.contact_user_id
                }
            })
        )
        // NO filtramos por lastMessage aquí:
        enriched.sort((a, b) => {
            const ta = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0
            const tb = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0
            return tb - ta
        })
        return enriched
    }

    static async getByUserId(owner_user_id, contact_user_id) {
        const contact = await ContactRepository.findByOwnerAndContactUser(
            owner_user_id,
            contact_user_id
        )
        if (!contact) {
            throw new ServerError(404, "Contacto no encontrado")
        }
        return contact
    }
}

export default ContactService