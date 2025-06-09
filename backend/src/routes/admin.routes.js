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
      const logsFile = req.files?.cms_log?.[0];
      const contactosFile = req.files?.contact_csv?.[0];

      if (!logsFile || !contactosFile) {
        return res.status(400).json({
          success: false,
          message: "Faltan archivos: logs y contactos son requeridos.",
        });
      }

      // Validación del nombre del archivo
      const nombreLogs = logsFile.originalname.toLowerCase();
      const nombreContactos = contactosFile.originalname.toLowerCase();

      const logsNombreValido =
        nombreLogs.includes("access");
      const contactosNombreValido =
        nombreContactos.includes("contact") || nombreContactos.endsWith(".csv");

      if (!contactosNombreValido) {
        return res.status(400).json({
          success: false,
          message:
            "Los archivos no coinciden con los esperados. Nombres inválidos.",
        });
      }


      // Conversión a texto
      const logsTxt_raw = logsFile.buffer.toString("utf-8").trim();
      const contactoTxt_raw = contactosFile.buffer.toString("utf-8").trim();

      // Validación de contenido vacío
      if (!logsTxt_raw || logsTxt_raw.length === 0) {
        return res.status(400).json({
          success: false,
          message: "El archivo de logs está vacío o no contiene datos válidos",
        });
      }

      if (!contactoTxt_raw || contactoTxt_raw.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "El archivo de contactos está vacío o no contiene datos válidos",
        });
      }

      // Procesamiento real
      const respuesta_procesamiento = await findAndSaveMatches({
        logs_raw: logsTxt_raw,
        contactos_raw: contactoTxt_raw,
      });

      res.status(200).json({
        success: true,
        message: "Datos procesados correctamente.",
        // ...respuesta_procesamiento, // si luego quieres incluir visitas/leads
      });
    } catch (error) {
      console.error("❌ Error general en /api/admin/match:", error);
      res.status(500).json({
        success: false,
        message: "Error interno al procesar los datos.",
      });
    }
  }
);

export default router;
