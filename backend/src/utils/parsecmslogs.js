import { parse, add } from "date-fns";

export function parseCMSLogs(rawLogText) {
  const lines = rawLogText.split('\n').filter(line => line.trim() !== '');
  const logs = [];

  for (const line of lines) {
    const logRegex = /^(\d{1,3}(?:\.\d{1,3}){3}) - - \[([^\]]+)\] "(GET|POST) ([^"]+?) HTTP\/[\d.]+" \d+ \d+/;
    const match = line.match(logRegex);

    if (!match) continue;

    const ip = match[1];
    const fechaStr = match[2];
    const urlPath = match[4];

    // Ignorar líneas que contengan /build o /storage
    if (urlPath.startsWith("/build") || urlPath.startsWith("/storage")) {
      continue;
    }

    const fechaLocal = parse(fechaStr, "dd/MMM/yyyy:HH:mm:ss X", new Date());
    const fechaLogConOffset = add(fechaLocal, { hours: 2 });

    const baseUrl = 'https://tamaritmotorcycles.com';
    const url = baseUrl + urlPath;

    const logObj = {
      ip,
      fecha_log: fechaLogConOffset,
      url,
    };

    if (
      urlPath.includes("utm_campaign") &&
      urlPath.includes("utm_source") &&
      urlPath.includes("id_afiliado")
    ) {
      const urlParams = new URLSearchParams(urlPath.split('?')[1]);
      const nombreEnlace = urlParams.get('utm_campaign') || '';
      const idAfiliado = urlParams.get('id_afiliado') || '';

      logObj.enlace_utm = url;
      logObj.id_afiliado = idAfiliado;
      logObj.utm_campaign = nombreEnlace;
    }

    logs.push(logObj);
    // console.log("logs parseados: ", logs)
  }

  return logs;
}
