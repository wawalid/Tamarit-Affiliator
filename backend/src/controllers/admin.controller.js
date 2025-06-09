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

  //----- PRIMER BUCLE: VISITAS -----
  console.log("[VISITAS] Iniciando análisis de visitas");
  for (const log of logs) {
    if (!log.enlace_utm) continue;

    const enlace = await EnlaceAfiliado.findOne({
      id_afiliado: log.id_afiliado,
      nombre_enlace: log.utm_campaign,
    });

    if (!enlace) {
      console.log(`[VISITAS] Enlace no encontrado para UTM: ${log.enlace_utm}`);
      continue;
    }

    const logDate = new Date(log.fecha_log);
    const logTimestampSec = Math.floor(logDate.getTime() / 1000);

    const ultimaVisitaTimestampSec = enlace.ultima_visita
      ? Math.floor(new Date(enlace.ultima_visita).getTime() / 1000)
      : 0;

    if (logTimestampSec < ultimaVisitaTimestampSec) {
      console.log(`[VISITAS] Visita antigua ignorada para IP ${log.ip} ${log.fecha_log}`);
      continue;
    }

    const visitaDuplicada = enlace.registro_visitas?.some((visita) => {
      const visitaTimestampSec = Math.floor(new Date(visita.timestamp).getTime() / 1000);
      return visita.ip === log.ip && visitaTimestampSec === logTimestampSec;
    });

    if (visitaDuplicada) {
      console.log(`[VISITAS] Visita duplicada ignorada para IP ${log.ip}`);
      continue;
    }

    await EnlaceAfiliado.updateOne(
      { _id: enlace._id },
      {
        $push: {
          registro_visitas: { ip: log.ip, timestamp: logDate },
        },
        $inc: { visitas: 1 },
        ...(logTimestampSec > ultimaVisitaTimestampSec && {
          $set: { ultima_visita: logDate },
        }),
      }
    );

    console.log(`[VISITAS] Visita añadida - IP: ${log.ip}, Enlace: ${log.enlace_utm}`);

    ipsAfiliadas.push({
      ip: log.ip,
      fecha_log: logDate,
      enlace_utm: log.enlace_utm,
    });
  }

  

  //----- SEGUNDO BUCLE: LEADS -----
  // console.log("[LEADS] Iniciando análisis de leads");
  // for (const { ip, fecha_log, enlace_utm } of ipsAfiliadas) {
  //   const enlace = await EnlaceAfiliado.findOne({
  //     'registro_visitas.ip': ip,
  //     nombre_enlace: enlace_utm.split("_").slice(1).join("_"), // ajusta si es necesario
  //   });

  //   if (!enlace) {
  //     console.log(`[LEADS] Enlace no encontrado en BD para UTM: ${enlace_utm}`);
  //     continue;
  //   }

  //   const logsContactoMismaIP = logs.filter(
  //     (l) => l.ip === ip && l.url.includes("contacto")
  //   );

  //   if (logsContactoMismaIP.length === 0) {
  //     console.log(`[LEADS] No se encontraron páginas de contacto para IP: ${ip}`);
  //     continue;
  //   }

  //   for (const contacto_csv of contactos_csv) {
  //     const fechaContacto = new Date(contacto_csv.fecha_contacto);
  //     const email = contacto_csv.email.toLowerCase().trim();

  //     if (ip === contacto_csv.ip && fechaContacto >= fecha_log) {
  //       const leadExistente = enlace.registro_leads?.some(
  //         (lead) => lead.contacto.toLowerCase().trim() === email
  //       );

  //       if (leadExistente) {
  //         console.log(`[LEADS] Lead duplicado ignorado: ${email}`);
  //         continue;
  //       }

  //       enlace.registro_leads = enlace.registro_leads || [];
  //       enlace.registro_leads.push({
  //         contacto: contacto_csv.email,
  //         fecha_lead: contacto_csv.fecha_contacto,
  //       });

  //       enlace.leads = (enlace.leads || 0) + 1;

  //       await enlace.save();

  //       console.log(`[LEADS] Lead añadido - Email: ${email}, IP: ${ip}`);
  //     }
  //   }
  // }

  // console.log("[FINALIZADO] Proceso completado correctamente.");

  //----- ACTUALIZAR FECHAS DEL SISTEMA -----
  const ultimoLog = logs[logs.length - 1];

  if (ultimoLog) {
    const systemMeta = await actualizarFechasSistema(
      new Date(ultimoLog.fecha_log)
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
    console.warn("[ADVERTENCIA] No se encontraron logs para actualizar la fecha del sistema.");
  }

  return {
    success: true,
  };
};
