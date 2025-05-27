import { get } from "mongoose";
import Match from "../models/match.model.js";
import { parseCMSLogs } from "../utils/parsecmslogs.js";
import { parseContactCSV } from "../utils/parseContactCSV.js";
import User from "../models/user.model.js";
import EnlaceAfiliado from "../models/affiliate_link.model.js";

export const findAndSaveMatches = async (formdata) => {
  const { logs_raw, contactos_raw } = formdata;
  if (!logs_raw || !contactos_raw) {
    throw new Error("Faltan datos: logs y pedidos son requeridos.");
  }

  try {
    const AffliateIDs = await User.find({}, { id_afiliado: 1 });
  } catch (error) {
    console.error(error);
    return res.status(500).json(["Error retrieving affiliate IDs"]);
  }

  const logs = await parseCMSLogs(logs_raw);
  const pedidos = await parseContactCSV(contactos_raw);
  const savedMatches = [];

  for (const log of logs) {
    console.log("log desde el controller", log);

    for (const pedido of pedidos) {
      if (log.ip === pedido.ip) {
        let nombre_enlace = "";
        if (log.enlace_utm) {
          try {
            const urlObj = new URL(log.enlace_utm);
            nombre_enlace = urlObj.searchParams.get("utm_campaign") || "";
          } catch (error) {
            nombre_enlace = "";
          }
        }

        // Comprobar si ya existe un match con esa IP y ese pedido
        const existingMatch = await Match.findOne({
          ip: log.ip,
          order_id: pedido.order_id,
        });

        if (!existingMatch) {
          const match = new Match({
            ip: log.ip,
            email: pedido.email,
            amount: pedido.amount,
            order_id: pedido.order_id,
            fecha_log: log.fecha_log,
            fecha_pedido: pedido.fecha_pedido,
            nombre_enlace: nombre_enlace,
            enlace_utm: log.enlace_utm || "",
            matched: true,
          });

          const saved = await match.save();
          savedMatches.push(saved);
        }
      }
    }

    // === Aquí actualizamos visitas por enlace ===

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
  }

  return savedMatches;
};
