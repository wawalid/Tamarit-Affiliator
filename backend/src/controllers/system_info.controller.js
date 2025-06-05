import { add } from "date-fns";
import System_info from "../models/system_info.model.js";

export const actualizarFechasSistema = async (fechaUltimoLog) => {
  const meta = await System_info.findOne();

  const fechaLocal = new Date();
  const fechamodificada = add(fechaLocal, { hours: 2 });

  if (!meta) {
    const nuevoMeta = await System_info.create({
      admin_fecha_ultima_actualizacion: fechamodificada,
      admin_fecha_ultimo_log: fechaUltimoLog,
    });
    return nuevoMeta;
  } else {
    meta.admin_fecha_ultima_actualizacion = fechamodificada;
    meta.admin_fecha_ultimo_log = fechaUltimoLog;
    await meta.save();
    return meta;
  }
};


export const getSystemInfo = async (req, res) => {
  try {
    const systemInfo = await System_info.findOne();
    if (!systemInfo) {
      return res.status(404).json({ message: "No se encontró información del sistema." });
    }
    res.json(systemInfo);
  } catch (error) {
    console.error("Error al obtener información del sistema:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};