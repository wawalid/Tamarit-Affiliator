import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    enlaces: {
      enlace1: { type: String, default: null, required: true },
      enlace2: { type: String, default: null },
      enlace3: { type: String, default: null },
    },
    is_admin: { type: Boolean, default: false },
    is_verified: { type: Boolean, default: false },
    is_banned: { type: Boolean, default: false },
    datos_bancarios: {
      cuenta_bancaria: { type: String, default: null },
      identidad: { type: String, default: null },
      dni : { type: String, default: null },
      completado: { type: Boolean, default: false },
    },
    fecha_registro: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
