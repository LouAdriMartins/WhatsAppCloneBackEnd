import mongoose from "mongoose"

const chatSchema = new mongoose.Schema(
    {
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users",
                required: true,
            },
        ],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },
    },
    { timestamps: true }
)

// Validación: solo 2 usuarios
chatSchema.pre("save", function (next) {
    if (this.users.length !== 2) {
        return next(new Error("Un chat debe tener exactamente dos usuarios"))
    }
    next()
})

const Chat = mongoose.model("Chat", chatSchema)
export default Chat
