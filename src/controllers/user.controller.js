import UserService from "../services/user.service.js"
import ServerError from "../utils/customError.utils.js"
import cloudinary from "../config/cloudinary.config.js"

class UserController {
    static async searchUser(req, res) {
        try {
            const { email, phone } = req.query
            const user = await UserService.searchUser({ email, phone })
            res.status(200).json({
                ok: true,
                status: 200,
                message: "Usuario encontrado",
                data: user
            })
        } 
        catch (error) {
            res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message || "Error al buscar usuario"
            })
        }
    }

    static async getAll(req, res) {
        try {
            const users = await UserService.getAllUsers()
            res.status(200).json({
                ok: true,
                data: users,
            })
        } 
        catch (error) {
            res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message || "Error al obtener usuarios"
            })
        }
    }

    static async uploadProfileImage(req, res) {
        try {
            const user_id = req.user?.user_id
            if (!user_id) throw new ServerError(401, "No autorizado")
            if (!req.file) {
                throw new ServerError(400, "No se recibió ninguna imagen")
            }
            const imageUrl = req.file.path
            const updated = await UserService.updateUser(user_id, {
                profile_image_url: imageUrl
            })
            return res.status(200).json({
                ok: true,
                message: "Foto actualizada",
                data: updated
            })
        } catch (error) {
            console.error("UPLOAD ERROR:", error)
            return res.status(error.status || 500).json({
                ok: false,
                message: error.message || "Error subiendo foto"
            })
        }
    }

    static async deletePhoto(req, res) {
        try {
            const user_id = req.user?.user_id
            if (!user_id) throw new ServerError(401, "No autorizado")
            const updated = await UserService.removeProfileImage(user_id)
            return res.status(200).json({
                ok: true,
                message: "Foto eliminada",
                data: updated
            })
        } catch (error) {
            console.error("DELETE PHOTO ERROR:", error)
            return res.status(error.status || 500).json({
                ok: false,
                message: error.message || "Error eliminando foto"
            })
        }
    }

    static async getMe(req, res) {
        try {
            const user_id = req.user?.user_id
            if (!user_id) {
                return res.status(401).json({
                    ok: false,
                    message: "Token inválido"
                })
            }
            const user = await UserService.getUserById(user_id)
            return res.json({
                ok: true,
                data: user
            })
        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                message: error.message
            })
        }
    }

    static async updateMe(req, res) {
        try {
            const user_id = req.user?.user_id
            if (!user_id) {
                return res.status(401).json({ ok: false, message: "Token inválido" })
            }
            const updated = await UserService.updateUser(user_id, req.body)

            return res.json({
                ok: true,
                message: "Perfil actualizado",
                data: updated
            })
        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                message: error.message
            })
        }
    }
}

export default UserController