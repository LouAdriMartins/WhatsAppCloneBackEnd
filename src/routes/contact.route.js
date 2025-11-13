import express from "express"
import ContactController from "../controllers/contact.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"

const contact_router = express.Router()

contact_router.post("/", authMiddleware, ContactController.createContact)
contact_router.get("/", authMiddleware, ContactController.getContacts)
contact_router.get("/contact/:contact_id", authMiddleware, ContactController.getById)
contact_router.get("/favorites/:owner_user_id", authMiddleware, ContactController.getFavorites)
contact_router.get("/:owner_user_id", authMiddleware, ContactController.getAll)
contact_router.get("/by-user/:contact_user_id", authMiddleware, ContactController.getByUserId)
contact_router.patch("/:contact_id", authMiddleware, ContactController.update)
contact_router.delete("/:contact_id", authMiddleware, ContactController.delete)
contact_router.patch("/block/:contact_id", authMiddleware, ContactController.toggleBlock)

export default contact_router