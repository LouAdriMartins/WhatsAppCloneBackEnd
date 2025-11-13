import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",           
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["sent", "delivered", "read"],
            default: "sent",
        },
        deletedAt: {
            type: Date,
            default: null,
        },
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            default: null,
        },
    },
    { timestamps: true }
)

const Message = mongoose.model("Message", messageSchema)
export default Message
