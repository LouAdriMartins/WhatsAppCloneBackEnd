import { Router } from "express"
import MessageController from "../controllers/message.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"

const message_router = Router()

message_router.post("/", authMiddleware, MessageController.createMessage)
message_router.get("/:chatId", authMiddleware, MessageController.getMessages)

message_router.delete("/:messageId", authMiddleware, MessageController.deleteMessage)

message_router.patch("/:messageId/delivered", authMiddleware, MessageController.markDelivered)
message_router.patch("/:messageId/read", authMiddleware, MessageController.markRead)

message_router.get("/:chatId/search", authMiddleware, MessageController.searchMessages)

export default message_router

