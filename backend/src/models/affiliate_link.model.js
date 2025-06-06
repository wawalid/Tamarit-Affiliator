import mongoose from "mongoose";

const visitaSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  timestamp: { type: Date, required: true },
});
const leadschema = new mongoose.Schema({
  contacto: { type: String, required: true },
  fecha_lead: { type: Date, required: false, default: null },
});



const afiliadoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nombre_enlace: {
      type: String,
      required: true,
    },
    enlace_original: {
      type: String,
      required: true,
    },
    enlace_utm: {
      type: String,
      required: true,
    },
    codigo_descuento: {
      type: String,
      required: false,
      default: null,
    },
    visitas: { type: Number, default: 0 },
    leads: { type: Number, default: 0 },
    ventas: { type: Number, default: 0 },
    comision: { type: Number, default: 0 },
    ultima_visita: { type: Date, default: null },

    registro_visitas: { type: [visitaSchema], default: [] },
    registro_leads: { type: [leadschema], default: [] },
    
  },
  {
    timestamps: true,
  }
);

// afiliadoSchema.index({ user: 1, enlace_original: 1 }, { unique: true });

export default mongoose.model("EnlaceAfiliado", afiliadoSchema);
