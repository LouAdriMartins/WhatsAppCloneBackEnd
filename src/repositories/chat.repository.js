import Chat from "../models/Chat.model.js"
import Message from "../models/Message.model.js"

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
            .populate({
                path: "lastMessage",
                select: "content createdAt status deletedAt deletedBy"
            })
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
        return Chat.findByIdAndUpdate(
            chatId,
            { lastMessage: messageId },
            { new: true }
        )
        .populate({
            path: "lastMessage",
            select: "content createdAt status deletedAt deletedBy"
        })
    }

    static async updateLastMessageAfterChange(chatId) {
        const lastMsg = await Message.find({ chatId })
            .sort({ createdAt: -1 })
            .limit(1)
        const newLastMessageId = lastMsg.length > 0
            ? lastMsg[0]._id
            : null
        return Chat.findByIdAndUpdate(
            chatId,
            { lastMessage: newLastMessageId },
            { new: true }
        )
        .populate({
            path: "lastMessage",
            select: "content createdAt status deletedAt deletedBy"
        })
    }
}

export default ChatRepository

