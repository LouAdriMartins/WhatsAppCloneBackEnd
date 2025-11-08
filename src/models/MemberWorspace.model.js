import mongoose from "mongoose"

const memberWorkspaceSchema = new mongoose.Schema(
    {
        fk_id_workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true
        },
        fk_id_usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rol: {
            type: String,
            enum: ['admin', 'support', 'user'],
            default: 'user',
            required: true
        },
        fecha_creacion: {
            type: Date,
            default: Date.now
        }
    }
)

const MembersWorkspace = mongoose.model('MemberWorkspace', memberWorkspaceSchema)
export default MembersWorkspace