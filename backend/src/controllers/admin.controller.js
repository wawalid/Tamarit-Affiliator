import Match from "../models/match.model.js";
import { parseCmsLogs } from "../utils/parseCmsLogs.js";
import { parseShopifyCSV } from "../utils/parseShopifyCSV.js";

export const findAndSaveMatches = async (formdata) => {
  const { logs_raw, pedidos_shopify_raw } = formdata;
  if (!logs_raw || !pedidos_shopify_raw) {
    throw new Error("Faltan datos: logs y pedidos son requeridos.");
  }
  // console.log("Archivos recibidos:", formdata);

  const logs = await parseCmsLogs(logs_raw);
  const pedidos = await parseShopifyCSV(pedidos_shopify_raw);
  const savedMatches = [];
  // console.log("logs desde el controller", logs);
  // console.log("pedidos desde el controller",pedidos);

  for (const log of logs) {
    // console.log("log desde el controller", log);
    for (const pedido of pedidos) {
      if (log.ip === pedido.ip) {
        // Extraer utm_campaign del enlace_utm
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
  }

  return savedMatches;
};
