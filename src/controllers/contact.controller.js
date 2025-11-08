// src/controllers/contact.controller.js
import ContactService from "../services/contact.service.js"
import ServerError from "../utils/customError.utils.js"

class ContactController {
    /* ======================================================
        CREAR CONTACTO
    ====================================================== */
    static async createContact(req, res) {
        try {
            const owner_user_id = req.user?.user_id
            if (!owner_user_id) {
                throw new ServerError(401, "Token inválido")
            }
            const { name, contact_email, phone_number } = req.body
            if (!name || !contact_email) {
                throw new ServerError(400, "Faltan name y contact_email")
            }
            const new_contact = await ContactService.createContact({
                owner_user_id,
                name,
                contact_email,
                phone_number,
            })
            return res.status(201).json({
                ok: true,
                status: 201,
                message: "Contacto creado correctamente",
                data: new_contact,
            })
        } 
        catch (error) {
            console.error(error)
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message || "Error interno del servidor",
            })
        }
    }

    /* ======================================================
        Obtener contactos de un usuario
    ====================================================== */
    static async getAll(req, res) {
        try {
            const { owner_user_id } = req.params
            const contacts = await ContactService.getContactsByUser(owner_user_id)
            return res.status(200).json({
                ok: true,
                status: 200,
                data: contacts
            })
        } 
        catch (error) {
            console.error(error)
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message
            })
        }
    }

    /* ======================================================
        Obtener contacto por ID
    ====================================================== */
    static async getById(req, res) {
        try {
            const { contact_id } = req.params
            const contact = await ContactService.getContactById(contact_id)
            return res.status(200).json({
                ok: true,
                status: 200,
                data: contact
            })
        } 
        catch (error) {
            console.error(error)
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message
            })
        }
    }

    /* ======================================================
        Buscar por nombre o email o número
    ====================================================== */
    static async getContacts(req, res) {
        try {
            const owner_user_id = req.user.user_id
            const searchTerm = req.query.search || ""
            const contacts = await ContactService.getContactsByUser(owner_user_id, searchTerm)
            res.status(200).json({
                ok: true,
                status: 200,
                message: "Contactos obtenidos correctamente",
                data: contacts,
            })
        } catch (error) {
            console.error("Error en getContacts:", error)
            res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message || "Error al obtener contactos",
            })
        }
    }

    /* ======================================================
        Actualizar contacto
    ====================================================== */
    static async update(req, res) {
        try {
            const { contact_id } = req.params
            const updated = await ContactService.updateContact(contact_id, req.body)
            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Contacto actualizado correctamente",
                data: updated
            })
        } 
        catch (error) {
            console.error(error)
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message
            })
        }
    }

    /* ======================================================
        Eliminar contacto
    ====================================================== */
    static async delete(req, res) {
        try {
            const { contact_id } = req.params
            const result = await ContactService.deleteContact(contact_id)
            return res.status(200).json({
                ok: true,
                status: 200,
                message: result.message
            })
        } 
        catch (error) {
            console.error(error)
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message
            })
        }
    }

    /* ======================================================
        Obtener favoritos
    ====================================================== */
    static async getFavorites(req, res) {
        try {
            const { owner_user_id } = req.params
            const favorites = await ContactService.getFavorites(owner_user_id)
            return res.status(200).json({
                ok: true,
                status: 200,
                data: favorites
            })
        } 
        catch (error) {
            console.error(error)
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message
            })
        }
    }

    /* ======================================================
        Bloquear contacto
    ====================================================== */
    static async toggleBlock(req, res) {
        try {
            const { contact_id } = req.params
            const { is_blocked } = req.body
            const updated = await ContactService.toggleBlock(
                contact_id,
                is_blocked
            )
            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Estado de bloqueo actualizado",
                data: updated
            })
        } 
        catch (error) {
            console.error(error)
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message
            })
        }
    }
}

export default ContactController