import express from "express";
import multer from "multer";
import { findAndSaveMatches } from "../controllers/admin.controller.js";

const router = express.Router();
const upload = multer();

router.post(
  "/match",
  upload.fields([
    { name: "cms_log", maxCount: 1 },
    { name: "contact_csv", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("📥 Endpoint /match alcanzado");
      console.log("Archivos recibidos:", Object.keys(req.files || {}));

      const logsFile = req.files?.cms_log?.[0];
      const contactosFile = req.files?.contact_csv?.[0];

      if (!logsFile || !contactosFile) {
        console.warn("⚠️ Archivos faltantes");
        return res
          .status(400)
          .json({ error: "Faltan archivos: logs y pedidos son requeridos." });
      }

      console.log("✔️ Ambos archivos presentes");
      console.log("Nombre del archivo de logs:", logsFile.originalname);
      console.log("Nombre del archivo de contactos:", contactosFile.originalname);

      const logsTxt_raw = logsFile.buffer.toString("utf-8");
      const contactoTxt_raw = contactosFile.buffer.toString("utf-8");

      console.log("📄 Archivos convertidos a texto");
      // console.log(logsText)
      // console.log(pedidosCsv)

      // CORREGIDO: Enviar como un único objeto
      const matches = await findAndSaveMatches({
        logs_raw: logsTxt_raw,
        contactos_raw: contactoTxt_raw,
      });

      console.log(`✅ ${matches.length} coincidencias encontradas y guardadas`);

      res.status(200).json({
        message: `${matches.length} coincidencias guardadas correctamente.`,
        data: matches,
      });
    } catch (error) {
      console.error("❌ Error en /api/admin/match:", error);
      res.status(500).json({ error: "Error procesando los archivos." });
    }
  }
);

export default router;
