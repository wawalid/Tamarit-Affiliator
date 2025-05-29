import { parseCMSLogs } from "../utils/parsecmslogs.js";
import { parseContactCSV } from "../utils/parseContactCSV.js";
import EnlaceAfiliado from "../models/affiliate_link.model.js";

export const findAndSaveMatches = async (formdata) => {
  const { logs_raw, contactos_raw } = formdata;
  if (!logs_raw || !contactos_raw) {
    throw new Error("Faltan datos: logs y contactos son requeridos.");
  }

  const logs = await parseCMSLogs(logs_raw);
  const contactos_csv = await parseContactCSV(contactos_raw);

  // Ordena los logs por fecha
  logs.sort((a, b) => new Date(a.fecha_log) - new Date(b.fecha_log));

  // Agrupa los logs por IP
  const logsPorIP = {};
  for (const log of logs) {
    if (!logsPorIP[log.ip]) logsPorIP[log.ip] = [];
    logsPorIP[log.ip].push(log);
  }

  for (const [ip, eventos] of Object.entries(logsPorIP)) {
    let enlaceTemporal = null;

    for (const evento of eventos) {
      const logDate = new Date(evento.fecha_log);

      // Si es un acceso con enlace_utm, lo tomamos como nuevo enlace activo
      if (evento.enlace_utm) {
        const enlace = await EnlaceAfiliado.findOne({ enlace_utm: evento.enlace_utm });
        if (!enlace) continue;

        const logTimestamp = logDate.getTime();
        const ultimaVisitaTimestamp = enlace.ultima_visita
          ? new Date(enlace.ultima_visita).getTime()
          : 0;

        const visitaExistente = enlace.registro_visitas.some(
          (v) => v.ip === ip && new Date(v.timestamp).getTime() === logTimestamp
        );

        if (!visitaExistente && logTimestamp >= ultimaVisitaTimestamp) {
          enlace.registro_visitas.push({ ip, timestamp: logDate });
          enlace.visitas = (enlace.visitas || 0) + 1;

          if (logTimestamp > ultimaVisitaTimestamp) {
            enlace.ultima_visita = logDate;
          }

          await enlace.save();
          console.log("✔ Visita registrada para IP:", ip);
        }

        // Guardamos el enlace temporal actual
        enlaceTemporal = enlace;
      }

      // // Si ha llegado al formulario de contacto y ya había accedido por un enlace afiliado antes
      // if (
      //   enlaceTemporal &&
      //   evento.url.includes("https://tamaritmotorcycles.com/contacto/")
      // ) {
      //   const contacto = contactos_csv.find((c) => c.ip === ip);
      //   if (!contacto) continue;

      //   const email = contacto.email;
      //   const leadExistente = enlaceTemporal.registro_leads.some(
      //     (l) => l.contacto === email
      //   );

      //   if (!leadExistente) {
      //     enlaceTemporal.registro_leads.push({ contacto: email });
      //     enlaceTemporal.leads = (enlaceTemporal.leads || 0) + 1;
      //     await enlaceTemporal.save();
      //     console.log(`🎯 Lead registrado para ${email} en enlace ${enlaceTemporal.enlace_utm}`);
      //   }

      //   // ⚠ IMPORTANTE: Evita que este email vuelva a contarse para otros enlaces
      //   break;
      // }
    }
  }

  return [];
};
