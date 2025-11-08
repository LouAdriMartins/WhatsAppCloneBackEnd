import express from 'express'
import WorkspaceController from '../controllers/workspace.controllers.js'

//Manejar consultas referidas a workspace
const workspace_router = express.Router()
workspace_router.get('/', WorkspaceController.getAll)
workspace_router.get('/:workspace_id', WorkspaceController.getById)

//Este es el endpoint para crear workspaces
workspace_router.post('/', WorkspaceController.post)

export default workspace_router