import Users from "../models/User.model.js"

class UserRepository {
    static async createUser({ name, email, password, profile_image_url }){
        const new_user = await Users.create({
            name,
            email,
            password,
            profile_image_url: profile_image_url ?? null
        })
        return new_user
    }

    static async getAll() {
        const users = await Users.find().select("-password")
        return users
    }

    static async getById(user_id) {
        const user_found = await Users.findById(user_id).select("-password")
        return user_found
    }

    static async deleteById(user_id) {
        await Users.findByIdAndDelete(user_id)
        return true
    }

    static async updateById(user_id, new_values) {
        return await Users.findByIdAndUpdate(user_id, new_values, { new: true })
    }

    static async getByEmail(email) {
        const user_found = await Users.findOne({ email })
        return user_found
    }
}

export default UserRepository
