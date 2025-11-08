import mongoose from "mongoose"

const channelWorkspaceSchema = new mongoose.Schema(
    {
        fk_id_workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true
        },
        nombre: {
            type: String,
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

const ChannelsWorkspace = mongoose.model('ChannelWorkspace', channelWorkspaceSchema)
export default ChannelsWorkspace