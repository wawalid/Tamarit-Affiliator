import { get } from "mongoose";
import { parseCMSLogs } from "../utils/parsecmslogs.js";
import { parseContactCSV } from "../utils/parseContactCSV.js";
import EnlaceAfiliado from "../models/affiliate_link.model.js";

export const findAndSaveMatches = async (formdata) => {
  //obtener los ficheros de logs y contactos
  const { logs_raw, contactos_raw } = formdata;
  if (!logs_raw || !contactos_raw) {
    throw new Error("Faltan datos: logs y contactos son requeridos.");
  }

  // try {
  //   const AffliateIDs = await User.find({}, { id_afiliado: 1 });
  // } catch (error) {
  //   console.error(error);
  //   return res.status(500).json(["Error retrieving affiliate IDs"]);
  // }

  // Parsear los logs y contactos
  const logs = await parseCMSLogs(logs_raw);
  const contactos_csv = await parseContactCSV(contactos_raw);
  const savedMatches = [];

  for (const log of logs) {
    // console.log("log desde el controller", log);

    // esto es la parte para contar visitas
    if (!log.enlace_utm) continue; // si no hay enlace, saltar

    const enlace = await EnlaceAfiliado.findOne({ enlace_utm: log.enlace_utm });
    if (!enlace) continue; // no existe enlace en BD

    const logDate = new Date(log.fecha_log);
    const logTimestampSec = Math.floor(logDate.getTime() / 1000);

    // se puede cambiar cogiendo la visita mas reciente del array
    const ultimaVisitaTimestampSec = enlace.ultima_visita
      ? Math.floor(new Date(enlace.ultima_visita).getTime() / 1000)
      : 0;

    if (logTimestampSec < ultimaVisitaTimestampSec) continue;

    // Comprobar si ya existe una visita con esta IP y mismo segundo en registro_visitas
    const visitaExistente = enlace.registro_visitas.some((visita) => {
      const visitaTimestampSec = Math.floor(
        new Date(visita.timestamp).getTime() / 1000
      );
      return visita.ip === log.ip && visitaTimestampSec === logTimestampSec;
    });

    if (visitaExistente) {
      // Ya contamos esta visita, no sumamos
      continue;
    }

    // Nueva visita válida: agregar a registro_visitas
    enlace.registro_visitas.push({
      ip: log.ip,
      timestamp: logDate,
    });

    enlace.visitas = (enlace.visitas || 0) + 1;

    if (logTimestampSec > ultimaVisitaTimestampSec) {
      enlace.ultima_visita = logDate;
    }

    await enlace.save();

    // // contador de leads
    //     for (const contacto_csv of contactos_csv) {
    //       if (log.ip === contacto_csv.ip) {

    //         const leadExistente = enlace.registro_leads.some((lead) => {
    //           return lead.contacto === contacto_csv.email;
    //         });

    //         if (leadExistente) {
    //           continue;
    //         }

    //         enlace.registro_leads.push({
    //           contacto: contacto.contacto,
    //         });

    //         enlace.leads = (enlace.leads || 0) + 1;

    //       }

    //     }

    
  }

  return savedMatches;
};
