import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: {
            type: String,
            required: true,
        },
        profile_image_url: {
            type: String,
            default: null,
        },
        verified_email: {
            type: Boolean,
            default: false,
        },
        verification_token: {
            type: String,
            default: null,
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
        modified_at: {
            type: Date,
            default: null,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        versionKey: false,
    }
)

const Users = mongoose.model("Users", userSchema)
export default Users