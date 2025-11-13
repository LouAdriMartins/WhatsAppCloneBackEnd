import Chat from "../models/chat.model.js"
import MessageRepository from "./message.repository.js"

class ChatRepository {
    static create(data) {
        return Chat.create(data)
    }

    static getById(id) {
        return Chat.findById(id)
            .populate("users", "name email profile_image_url")
            .populate("lastMessage")
    }

    static getAllForUser(userId) {
        return Chat.find({ users: userId })
            .populate("users", "name email profile_image_url")
            .populate("lastMessage")
            .sort({ updatedAt: -1 })
    }

    static findChatBetween(ownerId, contactUserId) {
        return Chat.findOne({
            users: { $all: [ownerId, contactUserId] },
        })
            .populate("users", "name email profile_image_url")
            .populate("lastMessage")
    }

    static async createPair(ownerId, contactUserId) {
        const existing = await Chat.findOne({
            users: { $all: [ownerId, contactUserId] },
        })
            .populate("users", "name email profile_image_url")
            .populate("lastMessage")
        if (existing) 
            return existing
        return Chat.create({ users: [ownerId, contactUserId] })
    }

    static async setLastMessage(chatId, messageId) {
        // Traemos el mensaje real (con su status correcto)
        const msg = await MessageRepository.findById(messageId)
        if (!msg) return
        return Chat.findByIdAndUpdate(
            chatId,
            {
                lastMessage: {
                    _id: msg._id,
                    content: msg.content,
                    status: msg.status,
                    createdAt: msg.createdAt
                }
            },
            { new: true }
        ).populate("users", "name email profile_image_url")
    }
}

export default ChatRepository

