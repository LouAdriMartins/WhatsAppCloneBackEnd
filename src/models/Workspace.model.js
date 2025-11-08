import mongoose from "mongoose"

const workspaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        descripcion: {
            type: String,
            //required: true
        },
        img_workspace: {
            type: String,
            //required: true
        },
        fecha_creacion: {
            type: Date,
            default: Date.now
        },
        fecha_modificacion: {
            type: Date,
            default: null
        },
        status: {
            type: Boolean,
            default: true
        }
    }
)

const Workspaces = mongoose.model('Workspace', workspaceSchema)
export default Workspaces