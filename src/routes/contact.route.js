import express from "express"
import ContactController from "../controllers/contact.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"

const contact_router = express.Router()

/*
- RUTAS BASE: /api/contacts - Ejemplo de uso:
POST   /api/contacts/                         → crear contacto
GET    /api/contacts/:owner_user_id           → obtener todos los contactos de un usuario
GET    /api/contacts/contact/:contact_id      → obtener un contacto específico
PATCH  /api/contacts/:contact_id              → actualizar contacto
DELETE /api/contacts/:contact_id              → eliminar contacto
GET    /api/contacts/favorites/:owner_user_id → listar favoritos
PATCH  /api/contacts/block/:contact_id        → bloquear/desbloquear
 */

contact_router.post("/", authMiddleware, ContactController.createContact)
contact_router.get("/", authMiddleware, ContactController.getContacts)
contact_router.get("/:owner_user_id", authMiddleware, ContactController.getAll)
contact_router.get("/contact/:contact_id", authMiddleware, ContactController.getById)
contact_router.patch("/:contact_id", authMiddleware, ContactController.update)
contact_router.delete("/:contact_id", authMiddleware, ContactController.delete)
contact_router.get("/favorites/:owner_user_id", authMiddleware, ContactController.getFavorites)
contact_router.patch("/block/:contact_id", authMiddleware, ContactController.toggleBlock)

export default contact_router