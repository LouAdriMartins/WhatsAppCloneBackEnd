import MessageService from "../services/message.service.js"
import { getIO } from "../socket.js"

class MessageController {
    async createMessage(req, res, next) {
        try {
            console.log("POST /api/messages BODY:", req.body)
            console.log("Usuario autenticado:", req.user)
            const requesterUserId = req.user?.user_id
            const { contactId, peerUserId, content } = req.body
            const msg = await MessageService.createMessage({
                requesterUserId,
                contactId,
                peerUserId,
                content,
            })
            // Emitir evento al room del chat
            getIO().to(msg.chatId.toString()).emit("message:new", msg)
            return res.status(201).json(msg)
        } catch (e) {
            next(e)
        }
    }

    async getMessages(req, res, next) {
        try {
            const { chatId } = req.params
            const messages = await MessageService.getMessages(chatId)
            return res.status(200).json(messages)
        } catch (e) {
            next(e)
        }
    }

    async deleteMessage(req, res, next) {
        try {
            const { messageId } = req.params
            const userId = req.user.user_id
            const info = await MessageService.deleteMessage({ messageId, userId })
            // Notificar a los demás
            getIO().to(info.chatId.toString()).emit("message:deleted", info.messageId)
            return res.status(200).json(info)
        } catch (e) {
            next(e)
        }
    }

    async markDelivered(req, res, next) {
        try {
            const { messageId } = req.params
            const msg = await MessageService.markDelivered(messageId)
            return res.status(200).json(msg)
        } catch (e) {
            next(e)
        }
    }

    async markRead(req, res, next) {
        try {
            const { messageId } = req.params
            const msg = await MessageService.markRead(messageId)
            return res.status(200).json(msg)
        } catch (e) {
            next(e)
        }
    }

    async searchMessages(req, res, next) {
        try {
            const { chatId } = req.params
            const { query } = req.query
            const results = await MessageService.searchMessages(chatId, query)
            return res.status(200).json(results)
        } catch (e) {
            next(e)
        }
    }
}

export default new MessageController()
