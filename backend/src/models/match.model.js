import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
    email: String,
    amount: Number,
    order_id: String,
    fecha_log: Date,
    fecha_pedido: Date,
    nombre_enlace: String,
    enlace_utm: String,
    matched: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Match", MatchSchema);
