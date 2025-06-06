import { parseCMSLogs } from "../utils/parsecmslogs.js";
import { parseContactCSV } from "../utils/parseContactCSV.js";
import EnlaceAfiliado from "../models/affiliate_link.model.js";
import { actualizarFechasSistema } from "../controllers/system_info.controller.js";

export const findAndSaveMatches = async (formdata) => {
  const { logs_raw, contactos_raw } = formdata;
  if (!logs_raw || !contactos_raw) {
    throw new Error("Faltan datos: logs y contactos son requeridos.");
  }

  console.log("[INICIO] Procesando logs y contactos");

  const logs = await parseCMSLogs(logs_raw);
  const contactos_csv = await parseContactCSV(contactos_raw);

  console.log(`[LOGS] Total: ${logs.length}`);
  console.log(`[CONTACTOS] Total: ${contactos_csv.length}`);

  const ipsAfiliadas = [];
  const enlacesModificados = new Map();

  //----- PRIMER BUCLE: VISITAS -----
  console.log("[VISITAS] Iniciando análisis de visitas");
  for (const log of logs) {
    if (!log.enlace_utm) continue;

    let enlace = enlacesModificados.get(log.enlace_utm);
    if (!enlace) {
      enlace = await EnlaceAfiliado.findOne({ enlace_utm: log.enlace_utm });
      if (!enlace) {
        console.log(
          `[VISITAS] Enlace no encontrado para UTM: ${log.enlace_utm}`
        );
        continue;
      }
      enlacesModificados.set(log.enlace_utm, enlace);
    }

    const logDate = new Date(log.fecha_log);
    const logTimestampSec = Math.floor(logDate.getTime() / 1000);

    const ultimaVisitaTimestampSec = enlace.ultima_visita
      ? Math.floor(new Date(enlace.ultima_visita).getTime() / 1000)
      : 0;

    if (logTimestampSec < ultimaVisitaTimestampSec) {
      console.log(`[VISITAS] Visita antigua ignorada para IP ${log.ip}`);
      continue;
    }

    const visitaExistente = enlace.registro_visitas?.some((visita) => {
      const visitaTimestampSec = Math.floor(
        new Date(visita.timestamp).getTime() / 1000
      );
      return visita.ip === log.ip && visitaTimestampSec === logTimestampSec;
    });

    if (visitaExistente) {
      console.log(`[VISITAS] Visita duplicada ignorada para IP ${log.ip}`);
      continue;
    }

    enlace.registro_visitas = enlace.registro_visitas || [];
    enlace.registro_visitas.push({
      ip: log.ip,
      timestamp: logDate,
    });

    enlace.visitas = (enlace.visitas || 0) + 1;

    if (logTimestampSec > ultimaVisitaTimestampSec) {
      enlace.ultima_visita = logDate;
    }

    console.log(
      `[VISITAS] Visita añadida - IP: ${log.ip}, Enlace: ${log.enlace_utm}`
    );

    ipsAfiliadas.push({
      ip: log.ip,
      fecha_log: logDate,
      enlace_utm: log.enlace_utm,
    });
  }

  //----- SEGUNDO BUCLE: LEADS -----
  console.log("[LEADS] Iniciando análisis de leads");
  for (const { ip, fecha_log, enlace_utm } of ipsAfiliadas) {
    const enlace = enlacesModificados.get(enlace_utm);
    if (!enlace) {
      console.log(
        `[LEADS] Enlace no encontrado en memoria para UTM: ${enlace_utm}`
      );
      continue;
    }

    const logsContactoMismaIP = logs.filter(
      (l) => l.ip === ip && l.url.includes("contacto")
    );

    if (logsContactoMismaIP.length === 0) {
      console.log(
        `[LEADS] No se encontraron páginas de contacto para IP: ${ip}`
      );
      continue;
    }

    for (const contacto_csv of contactos_csv) {
      const fechaContacto = new Date(contacto_csv.fecha_contacto);
      const email = contacto_csv.email.toLowerCase().trim();

      if (ip === contacto_csv.ip && fechaContacto >= fecha_log) {
        const leadExistente = enlace.registro_leads?.some(
          (lead) => lead.contacto.toLowerCase().trim() === email
        );

        if (leadExistente) {
          console.log(`[LEADS] Lead duplicado ignorado: ${email}`);
          continue;
        }

        enlace.registro_leads = enlace.registro_leads || [];
        enlace.registro_leads.push({
          contacto: contacto_csv.email,
          fecha_lead: contacto_csv.fecha_contacto,
        });

        enlace.leads = (enlace.leads || 0) + 1;

        console.log(`[LEADS] Lead añadido - Email: ${email}, IP: ${ip}`);
      }
    }
  }

  //----- GUARDAR CAMBIOS EN TODOS LOS ENLACES -----
  console.log("[GUARDAR] Guardando enlaces modificados...");
  for (const [utm, enlace] of enlacesModificados.entries()) {
    try {
      await enlace.save();
      console.log(`[GUARDAR] Guardado correcto para: ${utm}`);
    } catch (err) {
      console.error(`[ERROR GUARDADO] Enlace: ${utm} - ${err.message}`);
    }
  }

  console.log("[FINALIZADO] Proceso completado correctamente.");


  
  // Actualizar fechas del sistema
  const ultimoLog = logs[logs.length - 1];

  if (ultimoLog) {
    const systemMeta = await actualizarFechasSistema(
      new Date(ultimoLog.fecha_log)   // puede estar aqui el problemilla/bug
);
    console.log(
      "Última fecha de log actualizada en el sistema:",
      systemMeta.admin_fecha_ultimo_log
    );
    console.log(
      "Fecha de última actualización:",
      systemMeta.admin_fecha_ultima_actualizacion
    );
  } else {
    console.warn(
      "[ADVERTENCIA] No se encontraron logs para actualizar la fecha del sistema."
    );
  }

  return {
    success: true,
  };
};
