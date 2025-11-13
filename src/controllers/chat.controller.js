import ChatService from "../services/chat.service.js"

class ChatController {
    async createChat(req, res, next) {
        try {
            const { userA, userB } = req.body
            const chat = await ChatService.createChat({ userA, userB })
            res.status(201).json(chat)
        } catch (e) {
            next(e)
        }
    }

    async getChat(req, res, next) {
        try {
            const { id } = req.params
            const chat = await ChatService.getChat(id)
            res.status(200).json(chat)
        } catch (e) {
            next(e)
        }
    }

    async getUserChats(req, res, next) {
        try {
            const { userId } = req.params
            const chats = await ChatService.getUserChats(userId)
            res.status(200).json(chats)
        } catch (e) {
            next(e)
        }
    }
}

export default new ChatController()
