import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    id_afiliado: { type: String, default: null },
    rrss_1: { type: String, required: true },
    rrss_2: { type: String, default: null },
    rrss_3: { type: String, default: null },
    is_admin: { type: Boolean, default: false },
    is_verified: { type: Boolean, default: false },
    // is_banned: { type: Boolean, default: false },
    dni: { type: String, default: null },
    cuenta_bancaria: { type: String, default: null },
    identidad: { type: String, default: null },
    completado: { type: Boolean, default: false },
    fecha_registro: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
