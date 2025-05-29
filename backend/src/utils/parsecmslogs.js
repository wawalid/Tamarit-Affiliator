import { parse } from "date-fns";

export function parseCMSLogs(rawLogText) {
  const lines = rawLogText.split('\n').filter(line => line.trim() !== '');
  const logs = [];

  for (const line of lines) {
    // Regex para extraer IP, fecha y URL
    const logRegex = /^(\d{1,3}(?:\.\d{1,3}){3}) - - \[([^\]]+)\] "GET ([^"]+?) HTTP\/[\d.]+" \d+ \d+/;
    const match = line.match(logRegex);

    if (!match) continue;

    const ip = match[1];
    const fechaStr = match[2]; // ej: 07/May/2025:08:49:58 +0200
    const urlPath = match[3];

    const fechaLog = parse(fechaStr, "dd/MMM/yyyy:HH:mm:ss X", new Date());
    const baseUrl = 'https://tamaritmotorcycles.com';
    const url = baseUrl + urlPath;

    // Creamos el objeto base
    const logObj = {
      ip,
      fecha_log: fechaLog,
      url, // siempre
    };

    // Si tiene parámetros UTM, los procesamos y añadimos campos extra
    if (
      urlPath.includes("utm_campaign") &&
      urlPath.includes("utm_source") &&
      urlPath.includes("id_afiliado")
    ) {
      const urlParams = new URLSearchParams(urlPath.split('?')[1]);
      const nombreEnlace = urlParams.get('utm_campaign') || '';

      logObj.enlace_utm = url; // es la URL con los UTM
      logObj.nombre_enlace = nombreEnlace;
    }

    logs.push(logObj);
  }

  return logs;
}
