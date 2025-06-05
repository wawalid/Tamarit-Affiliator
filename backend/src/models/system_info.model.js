import mongoose from "mongoose";

const SystemInfoSchema = new mongoose.Schema({
  admin_fecha_ultima_actualizacion: {
    type: Date,
    default: null,
  },
  admin_fecha_ultimo_log: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

export default mongoose.model("System_info", SystemInfoSchema);
