import UserService from "../services/user.service.js";
import ServerError from "../utils/customError.utils.js";

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

    // Subir foto de perfil
    static async uploadProfileImage(req, res) {
        try {
            const user_id = req.user?.user_id;
            if (!user_id) {
                throw new ServerError(401, "No autorizado")
            }
            if (!req.file?.path) {
                throw new ServerError(400, "No se envió ninguna imagen")
            }
            const updatedUser = await UserService.updateProfileImage(
                user_id,
                req.file.path
            )
            return res.json({
                ok: true,
                message: "Imagen subida correctamente",
                data: updatedUser
            })
        } catch (error) {
            console.error(error);
            return res.status(error.status || 500).json({
                ok: false,
                message: error.message || "Error subiendo la imagen",
            })
        }
    }
}

export default UserController