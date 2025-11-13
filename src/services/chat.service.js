import ChatRepository from "../repositories/chat.repository.js"
import ServerError from "../utils/customError.utils.js"

class ChatService {
    async createChat({ userA, userB }) {
        if (!userA || !userB) {
            throw new ServerError(400, "Son requeridos 2 usuarios")
        }
        // Usamos el método que existe
        const existing = await ChatRepository.findChatBetween(userA, userB)
        if (existing) 
            return existing
        return ChatRepository.create({ users: [userA, userB] })
    }

    async getChat(chatId) {
        const chat = await ChatRepository.getById(chatId)
        if (!chat) {
            throw new ServerError(404, "No funciona el chat")
        }
        return chat
    }

    async getUserChats(userId) {
        return ChatRepository.getAllForUser(userId)
    }
}

export default new ChatService()
