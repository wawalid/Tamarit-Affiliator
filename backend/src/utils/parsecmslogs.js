// src/utils/parsecmslogs.js
import { parse } from "date-fns";

export function parseCMSLogs(rawLogText) {
  const lines = rawLogText.split('\n').filter(line => line.trim() !== '');
  const logs = [];

  for (const line of lines) {
    // Regex para extraer IP, fecha y URL
    const logRegex = /^(\d{1,3}(?:\.\d{1,3}){3}) - - \[([^\]]+)\] "(GET|POST) ([^"]+?) HTTP\/[\d.]+" \d+ \d+/;
    const match = line.match(logRegex);

    if (!match) continue;

    const ip = match[1];
    const fechaStr = match[2]; // Ej: "03/Jun/2025:10:28:51 +0200"
    const urlPath = match[4];

    // Esto devuelve un objeto Date con la hora local (por el offset +0200)
    const fechaLocal = parse(fechaStr, "dd/MMM/yyyy:HH:mm:ss X", new Date());

    const baseUrl = 'https://tamaritmotorcycles.com';
    const url = baseUrl + urlPath;

    const logObj = {
      ip,
      fecha_log: fechaLocal, // ⬅️ esto es un objeto Date con hora local España
      url,
    };

    if (
      urlPath.includes("utm_campaign") &&
      urlPath.includes("utm_source") &&
      urlPath.includes("id_afiliado")
    ) {
      const urlParams = new URLSearchParams(urlPath.split('?')[1]);
      const nombreEnlace = urlParams.get('utm_campaign') || '';

      logObj.enlace_utm = url;
      logObj.nombre_enlace = nombreEnlace;
    }

    logs.push(logObj);
  }

  return logs;
}
