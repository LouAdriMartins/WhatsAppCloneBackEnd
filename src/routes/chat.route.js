import { Router } from "express"
import ChatController from "../controllers/chat.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"

const chat_router = Router()

chat_router.get("/user/:userId", authMiddleware, ChatController.getUserChats)
chat_router.get("/:id", authMiddleware, ChatController.getChat)
chat_router.post("/", authMiddleware, ChatController.createChat)

export default chat_router
