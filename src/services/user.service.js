import UserRepository from "../repositories/user.repository.js"
import ServerError from "../utils/customError.utils.js"

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

}

export default UserService