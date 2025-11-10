import express from "express"
import UserController from "../controllers/user.controller.js"
import upload from "../config/multer.config.js"
import AuthMiddleware from "../middleware/auth.middleware.js"

const router = express.Router()

// Buscar usuario por email o teléfono
router.get("/search", UserController.searchUser)

// Obtener todos los usuarios
router.get("/", UserController.getAll)

// Subir imagen de perfil
router.post("/upload-photo", AuthMiddleware, upload.single("profile_image"), UserController.uploadProfileImage)

router.delete("/delete-photo", AuthMiddleware, UserController.deletePhoto)

/// Obtener mi info
router.get("/me", AuthMiddleware, UserController.getMe)

// Editar datos (name, phone…)
router.put("/me", AuthMiddleware, UserController.updateMe)


export default router