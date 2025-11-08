import mongoose from "mongoose"

const messageChannelSchema = new mongoose.Schema(
    {
        fk_id_miembro_workspace_emisor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MemberWorkspace',
            required: true
        },
        fk_canal_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ChannelWorkspace',
            required: true
        },
        texto: {
            type: String,
            maxlength: 1500,
            required: true
        },
        fecha_creacion: {
            type: Date,
            default: Date.now
        },
        status: {
            type: Boolean,
            default: true
        }
    }
)

const MessagesChannel = mongoose.model('MessageChannel', messageChannelSchema)
export default MessagesChannel