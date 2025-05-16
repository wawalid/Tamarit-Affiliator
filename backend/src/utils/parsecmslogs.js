import { parse } from "date-fns";

export function parseCmsLogs(rawLogText) {
  const lines = rawLogText.split('\n').filter(line => line.trim() !== '');
  const logs = [];

  for (const line of lines) {
    // Regex para extraer IP, fecha y URL con parámetros UTM
    const logRegex = /^(\d{1,3}(?:\.\d{1,3}){3}) - - \[([^\]]+)\] "GET ([^"]+?) HTTP\/[\d.]+" \d+ \d+/;
    const match = line.match(logRegex);

    if (!match) continue;

    const ip = match[1];
    const fechaStr = match[2]; // ej: 07/May/2025:08:49:58 +0200
    const urlPath = match[3];

    // Usamos date-fns para parsear la fecha correctamente
    const fechaLog = parse(fechaStr, "dd/MMM/yyyy:HH:mm:ss X", new Date());

    const baseUrl = 'https://tamaritmotorcycles.com';
    const enlaceUtm = baseUrl + urlPath;

    const urlParams = new URLSearchParams(urlPath.split('?')[1]);
    const nombreEnlace = urlParams.get('utm_campaign') || '';

    logs.push({
      ip,
      fecha_log: fechaLog,
      enlace_utm: enlaceUtm,
      nombre_enlace: nombreEnlace,
    });
  }

  // console.log("Logs parseados:", logs);
  return logs;
}
