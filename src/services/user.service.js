import UserRepository from "../repositories/user.repository.js"
import ServerError from "../utils/customError.utils.js"
import cloudinary from "../config/cloudinary.config.js"

class UserService {
    // Buscar usuario por email o teléfono
    static async searchUser({ email, phone }) {
        if (!email && !phone) {
            throw new ServerError(400, "Debes enviar 'email' o 'phone' como parámetro de búsqueda")
        }
        let user_found = null
        if (email) {
            user_found = await UserRepository.getByEmail(email)
        } 
        if (!user_found) {
            throw new ServerError(404, "Usuario no encontrado")
        }
        // Devuelve solo datos no sensibles
        return {
            id: user_found._id,
            name: user_found.name,
            email: user_found.email,
        }
    }

    // Obtener todos los usuarios
    static async getAllUsers() {
        const users = await UserRepository.getAll()
        return users
    }

    // Obtener usuario por ID
    static async getUserById(user_id) {
        const user = await UserRepository.getById(user_id)
        if (!user) {
            throw new ServerError(404, "Usuario no encontrado")
        }
        return user
    }

    static async updateProfileImage(user_id, image_url) {
        return await UserRepository.updateById(user_id, {
            profile_image_url: image_url,
            modified_at: new Date()
        })
    }

    static async removeProfileImage(user_id) {
        const user = await UserRepository.getById(user_id)
        if (!user) {
            throw new ServerError(404, "Usuario no encontrado")
        }
        // Si tenía imagen, borramos de Cloudinary
        if (user.profile_image_url) {
            const public_id = user.profile_image_url
                .split("/")
                .pop()
                .split(".")[0]
            await cloudinary.uploader.destroy(`profile_images/${public_id}`)
        }
        // Seteamos en null
        const updated_user = await UserRepository.updateById(user_id, {
            profile_image_url: null
        })
        return updated_user
    }

    static async updateUser(user_id, new_values) {
        const allowedFields = ["name", "info", "phone_number", "profile_image_url"]
        const filtered = {}
        for (const key of allowedFields) {
            if (new_values[key] !== undefined) {
                filtered[key] = new_values[key]
            }
        }
        filtered.modified_at = new Date()
        const updated = await UserRepository.updateById(user_id, filtered)
        if (!updated) {
            throw new ServerError(404, "No se pudo actualizar el usuario")
        }
        new_values.modified_at = new Date()
        return updated
    }
}

export default UserService