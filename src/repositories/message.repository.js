import Message from "../models/message.model.js"

class MessageRepository {
    static create({ chatId, sender, content }) {
        return Message.create({ chatId, sender, content })
    }

    static getByChatId(chatId) {
        return Message.find({ chatId })
            .populate("sender", "name email profile_image_url")
            .sort({ createdAt: 1 })
    }

    static deleteMessage(messageId, userId) {
        return Message.findByIdAndUpdate(
            messageId,
            {
                deletedAt: new Date(),
                deletedBy: userId,
                content: "Mensaje eliminado",
            },
            { new: true }
        )
    }

    static updateStatus(messageId, status) {
        return Message.findByIdAndUpdate(messageId, { status }, { new: true })
    }

    static searchInChat(chatId, query) {
        return Message.find({
            chatId,
            content: { $regex: query, $options: "i" },
        }).sort({ createdAt: -1 })
    }

    static countUnread(chatId, myUserId) {
        return Message.countDocuments({
            chatId,
            sender: { $ne: myUserId },
            status: { $ne: "read" },
        })
    }

    static findById(messageId) {
        return Message.findById(messageId)
    }
}

export default MessageRepository
