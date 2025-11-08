import Contacts from "../models/Contact.model.js"

class ContactRepository {
    /* ------------------------------------------------------
        Crear contacto
    ------------------------------------------------------ */
    static async createContact(data) {
        const new_contact = await Contacts.create(data)
        return new_contact
    }

    /* ------------------------------------------------------
        Buscar contactos por owner + término
    ------------------------------------------------------ */
    static async searchContacts(owner_user_id, searchTerm = "") {
        const query = {
            owner_user_id,
            ...(searchTerm
                ? {
                    $or: [
                    { name: { $regex: searchTerm, $options: "i" } },
                    { contact_email: { $regex: searchTerm, $options: "i" } },
                    { phone_number: { $regex: searchTerm, $options: "i" } },
                    ],
                }
            : {}),
        }
        return await Contacts.find(query)
            .sort({ name: 1 })
            .select("-__v")
            .lean()
    }

    /* ------------------------------------------------------
        Obtener contactos de un usuario
    ------------------------------------------------------ */
    static async getContactsByUser(owner_user_id) {
        return await Contacts.find({ owner_user_id })
            .sort({ name: 1 })
            .select("-__v")
    }

    /* ------------------------------------------------------
        Obtener contacto por ID
    ------------------------------------------------------ */
    static async getById(contact_id) {
        return await Contacts.findById(contact_id).select("-__v")
    }

    /* ------------------------------------------------------
        Buscar en contactos del usuario:
            owner_user_id + contact_user_id
        Se usa para evitar duplicados
    ------------------------------------------------------ */
    static async findByOwnerAndContactUser(owner_user_id, contact_user_id) {
        return await Contacts.findOne({
            owner_user_id,
            contact_user_id,
        })
    }

    /* ------------------------------------------------------
        Buscar por email dentro de contactos de un usuario
    ------------------------------------------------------ */
    static async findByOwnerAndEmail(owner_user_id, contact_email) {
        return await Contacts.findOne({ owner_user_id, contact_email })
    }

    /* ------------------------------------------------------
        Actualizar contacto
    ------------------------------------------------------ */
    static async updateById(contact_id, new_values) {
        return await Contacts.findByIdAndUpdate(
            contact_id,
            new_values,
            { new: true }
        ).select("-__v")
    }

    /* ------------------------------------------------------
        Eliminar contacto
    ------------------------------------------------------ */
    static async deleteById(contact_id) {
        await Contacts.findByIdAndDelete(contact_id)
        return true
    }

    /* ------------------------------------------------------
        Obtener favoritos
    ------------------------------------------------------ */
    static async getFavorites(owner_user_id) {
        return await Contacts.find({
            owner_user_id,
            is_favorite: true,
        })
        .sort({ name: 1 })
        .select("-__v")
    }

    /* ------------------------------------------------------
        Bloquear contacto
    ------------------------------------------------------ */
    static async toggleBlock(contact_id, is_blocked) {
        return await Contacts.findByIdAndUpdate(
            contact_id,
            { is_blocked },
            { new: true }
        ).select("-__v")
    }
}

export default ContactRepository