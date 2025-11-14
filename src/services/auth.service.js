import transporter from "../config/mailer.config.js"
import UserRepository from "../repositories/user.repository.js"
import ServerError from "../utils/customError.utils.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import ENVIRONMENT from "../config/environment.config.js"

class AuthService {
    // ==================== REGISTRO DE USUARIO ====================
    static async register(name, email, password) {
        const user_found = await UserRepository.getByEmail(email)
        if (user_found) {
            throw new ServerError(400, "Email ya en uso")
        }
        const password_hashed = await bcrypt.hash(password, 12)
        const user_created = await UserRepository.createUser({
            name,
            email,
            password: password_hashed,
        })
        const verification_token = jwt.sign(
        {
            email,
            user_id: user_created._id.toString(),
        },
        ENVIRONMENT.JWT_SECRET_KEY,
        { expiresIn: "1d" }
        );
        const verify_link = `${ENVIRONMENT.URL_API}/api/auth/verify-email/${verification_token}`
        try {
            await transporter.sendMail({
                from: `"Lourdes Dev" <${ENVIRONMENT.BREVO_EMAIL}>`,
                to: email,
                subject: "Verificación de correo electrónico",
                html: `
                <div style="font-family:Arial, sans-serif; color:#333">
                    <h2>¡Hola ${name}!</h2>
                    <p>Gracias por registrarte. Para activar tu cuenta, hacé clic en el siguiente enlace:</p>
                    <p>
                    <a href="${verify_link}"
                        style="display:inline-block;background:#5865F2;color:white;padding:10px 20px;
                                text-decoration:none;border-radius:6px;margin-top:10px;">
                        Verificar mi cuenta
                    </a>
                    </p>
                    <p>Si no creaste esta cuenta, ignora este mensaje.</p>
                </div>
                `,
            })
        } catch (error) {
            console.error("Error enviando mail:", error)
        }
        return user_created
    }

    // ==================== VERIFICACIÓN DE EMAIL ====================
    static async verifyEmail(verification_token) {
        try {
            const payload = jwt.verify(
                verification_token,
                ENVIRONMENT.JWT_SECRET_KEY
            )
            await UserRepository.updateById(payload.user_id, {
                verified_email: true,
            })
            return
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError(400, "Token inválido o expirado");
            }
            throw error;
        }
    }

    // ==================== LOGIN DE USUARIO ====================
    static async login(email, password) {
        const user = await UserRepository.getByEmail(email)
        if (!user) {
            throw new ServerError(404, "Email no registrado")
        }
        if (!user.active) {
            throw new ServerError(403, "Usuario deshabilitado")
        }
        if (user.verified_email === false) {
            throw new ServerError(401, "Email no verificado")
        }
        const is_same_password = await bcrypt.compare(password, user.password)
        if (!is_same_password) {
            throw new ServerError(401, "Contraseña incorrecta")
        }
        const authorization_token = jwt.sign(
        {
            user_id: user._id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
        },
        ENVIRONMENT.JWT_SECRET_KEY,
        { expiresIn: "7d" }
        )
        return { authorization_token }
    }

    // ==================== RECUPERACIÓN DE CONTRASEÑA ====================
    static async recoverPassword(email) {
        const user = await UserRepository.getByEmail(email)
        if (!user) {
            throw new ServerError(404, "No existe una cuenta registrada con ese email")
        }
        const recovery_token = jwt.sign(
            { user_id: user._id, email },
            ENVIRONMENT.JWT_SECRET_KEY,
            { expiresIn: "15m" }
        )
        const recovery_link = `${ENVIRONMENT.URL_FRONT}/reset-password/${recovery_token}`
        try {
            await transporter.sendMail({
                from: `"Lourdes Dev" <${ENVIRONMENT.BREVO_EMAIL}>`,
                to: email,
                subject: "Recuperación de contraseña",
                html: `
                    <div style="font-family:Arial,sans-serif;color:#333">
                        <h2>Recuperar contraseña</h2>
                        <p>Hacé clic en el siguiente enlace para restablecer tu contraseña. Este enlace expirará en 15 minutos.</p>
                        <a href="${recovery_link}" 
                        style="background:#5865F2;color:white;padding:10px 20px;text-decoration:none;
                                border-radius:6px;display:inline-block;margin-top:10px;">
                        Restablecer contraseña
                        </a>
                        <p>Si no solicitaste este cambio, ignorá este mensaje.</p>
                    </div>
                `
            })
        } catch (error) {
            console.error("Error enviando email de recuperación:", error)
            throw new ServerError(500, "No se pudo enviar el correo de recuperación")
        }
        return { message: "Correo de recuperación enviado" }
    }

    static async resetPassword(token, new_password) {
        try {
            const payload = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY)
            const password_hashed = await bcrypt.hash(new_password, 12)
            await UserRepository.updateById(payload.user_id, { password: password_hashed })
            return { message: "Contraseña actualizada correctamente" }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ServerError(400, "El enlace de recuperación ha expirado")
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError(400, "Token inválido")
            }
            throw error
        }
    }
}

export default AuthService
