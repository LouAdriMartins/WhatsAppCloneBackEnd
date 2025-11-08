import Workspaces from "../models/Workspace.model.js"

class WorkspaceRepository {
    static async createWorkspace(name, descripcion, img_workspace){
        //Logica de interaccion con la DB para crear el workspace
        await Workspaces.insertOne({
            name: name,
            descripcion: descripcion,
            img_workspace: img_workspace
        })
        return true
    }

    static async getAll(){
        const workspaces = await Workspaces.find()
        return workspaces
    }

    static async getById(workspace_id){
        const workspace_found = await Workspaces.findById(workspace_id)
        return workspace_found
    }

    static async deleteById(workspace_id){
        await Workspaces.findByIdAndDelete(workspace_id)
        return true
    }

    static async updateById(workspace_id, new_values){
        const workspace_updated = await Workspaces.findByIdAndUpdate(
            workspace_id, 
            new_values, 
            {
                new: true
            } 
        )
        return workspace_updated
    }
}

export default WorkspaceRepository