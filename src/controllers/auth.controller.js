import AuthService from "../services/auth.service.js"
import ServerError from "../utils/customError.utils.js"
import UserRepository from "../repositories/user.repository.js"

class AuthController {
    static async register(request, response) {
        try {
            const { name, email, password } = request.body
            console.log(request.body)
            if (!name?.trim()) {
                throw new ServerError(400, 'Debes enviar un nombre válido')
            }
            if (!email?.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                throw new ServerError(400, 'Debes enviar un email válido')
            }
            if (!password || password.length < 8) {
                throw new ServerError(400, 'La contraseña debe tener al menos 8 caracteres')
            }
            await AuthService.register(name, email, password)
            response.status(201).json({
                ok: true,
                status: 201,
                message: 'Usuario registrado correctamente. Revisa tu correo para verificar la cuenta.'
            })
        } 
        catch (error) {
            console.error(error)
            if (error.status) {
                return response.status(error.status).json({
                    ok: false,
                    status: error.status,
                    message: error.message
                })
            }
            return response.status(500).json({
                ok: false,
                status: 500,
                message: 'Error interno del servidor'
            })
        }
    }

    static async login(request, response) {
        try {
            const { email, password } = request.body
            const { authorization_token } = await AuthService.login(email, password)
            const user = await UserRepository.getByEmail(email)

            return response.json({
                ok: true,
                status: 200,
                message: 'Logueado con éxito',
                data: {
                token: authorization_token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
                }
            })
        } 
        catch (error) {
            console.error(error)
            if (error.status) {
                return response.status(error.status).json({
                    ok: false,
                    status: error.status,
                    message: error.message
                })
            }
            return response.status(500).json({
                ok: false,
                status: 500,
                message: 'Error interno del servidor'
            })
        }
    }

    static async verifyEmail(request, response) {
        try {
            const { verification_token } = request.params
            await AuthService.verifyEmail(verification_token)
            // Redirigir al login del front (ruta "/")
            return response.redirect(`${ENVIRONMENT.URL_FRONT}/`)
        } 
        catch (error) {
            console.error(error)
            if (error.status) {
                return response.status(error.status).json({
                    ok: false,
                    status: error.status,
                    message: error.message
                })
            }
            return response.status(500).json({
                ok: false,
                status: 500,
                message: 'Error interno del servidor'
            })
        }
    }

    static async recoverPassword(request, response) {
        try {
            const { email } = request.body
            if (!email) {
                throw new ServerError(400, "Debes enviar un email válido")
            }

            const result = await AuthService.recoverPassword(email)
            return response.status(200).json({
                ok: true,
                status: 200,
                message: result.message
            })
        } catch (error) {
            console.error(error)
            return response.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message || "Error interno del servidor"
            })
        }
    }

    static async resetPassword(request, response) {
        try {
            const { token } = request.params
            const { new_password } = request.body
            if (!new_password || new_password.length < 8) {
                throw new ServerError(400, "La nueva contraseña debe tener al menos 8 caracteres")
            }
            const result = await AuthService.resetPassword(token, new_password)
            return response.status(200).json({
                ok: true,
                status: 200,
                message: result.message
            })
        } catch (error) {
            console.error(error)
            return response.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message || "Error interno del servidor"
            })
        }
    }

}

export default AuthController
