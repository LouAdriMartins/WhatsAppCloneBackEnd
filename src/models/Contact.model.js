import mongoose from "mongoose"

const contactSchema = new mongoose.Schema(
  {
    // Usuario propietario de la agenda
    owner_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Usuario real (de la app) al que apunta el contacto
    contact_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // se exige que exista el usuario en la app
    },
    contact_email: {
      type: String,
      required: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone_number: {
      type: String,
      default: null,
      trim: true,
      match: [/^\+?\d{8,15}$/, "Formato de número inválido"],
    },
    // Se inicializa con la foto del usuario real, si tiene
    profile_image_url: {
      type: String,
      default: null,
    },
    is_blocked: { type: Boolean, default: false },
    is_favorite: { type: Boolean, default: false },
    last_synced_at: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
)

contactSchema.index({ owner_user_id: 1, contact_user_id: 1 }, { unique: true })
contactSchema.index({ owner_user_id: 1, contact_email: 1 }, { unique: true })

const Contacts = mongoose.model("Contacts", contactSchema)
export default Contacts