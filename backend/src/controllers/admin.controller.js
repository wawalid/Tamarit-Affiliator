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

  const ipsAfiliadas = [];


  // PRIMER BUCLE: VISITAS
  for (const log of logs) {
    if (!log.enlace_utm) continue;

    const enlace = await EnlaceAfiliado.findOne({ enlace_utm: log.enlace_utm });
    if (!enlace) continue;

    const logDate = new Date(log.fecha_log);
    const logTimestampSec = Math.floor(logDate.getTime() / 1000);

    const ultimaVisitaTimestampSec = enlace.ultima_visita
      ? Math.floor(new Date(enlace.ultima_visita).getTime() / 1000)
      : 0;

    if (logTimestampSec < ultimaVisitaTimestampSec) continue;

    const visitaExistente = enlace.registro_visitas.some((visita) => {
      const visitaTimestampSec = Math.floor(
        new Date(visita.timestamp).getTime() / 1000
      );
      return visita.ip === log.ip && visitaTimestampSec === logTimestampSec;
    });

    if (visitaExistente) continue;

    enlace.registro_visitas.push({
      ip: log.ip,
      timestamp: logDate,
    });

    enlace.visitas = (enlace.visitas || 0) + 1;

    if (logTimestampSec > ultimaVisitaTimestampSec) {
      enlace.ultima_visita = logDate;
    }

    await enlace.save();
    ipsAfiliadas.push({ ip: log.ip, fecha_log: logDate, enlace });
  }




  
  // SEGUNDO BUCLE: LEADS
for (const contacto_csv of contactos_csv) {
  const ip = contacto_csv.ip;
  const enlaceMatch = ipsAfiliadas.find((item) => item.ip === ip);

  if (!enlaceMatch) continue;

  const { enlace } = enlaceMatch;

  const haVisitadoContacto = logs.some(
    (l) => l.ip === ip && l.url.includes("contacto")
  );

  if (!haVisitadoContacto) continue;


if (!contacto_csv.fecha_contacto) {
  console.warn(`Contacto con email ${contacto_csv.email} no tiene fecha_contacto. Saltando...`);
  continue;
}



  // Prevenir duplicado del lead
  const leadExistente = enlace.registro_leads?.some(
    (lead) =>
      lead.contacto.toLowerCase().trim() ===
      contacto_csv.email.toLowerCase().trim()
  );

  if (leadExistente) continue;

  enlace.registro_leads = enlace.registro_leads || [];
  enlace.registro_leads.push({
    contacto: contacto_csv.email,
    fecha_lead: contacto_csv.fecha_contacto,
  });
  enlace.leads = (enlace.leads || 0) + 1;

  await enlace.save();
}



  // contador de €
  // un bucle for para recorrer todos los enlaces y mirar dentro de sus registro_leads y pasarle a la api de shopi ese correo y el momento en el que se hizo
    const enlace_tmp = await EnlaceAfiliado.findOne({ nombre_enlace: "probando fechas" });
    console.log(enlace_tmp)
  return {
    success: true,
  };
};
