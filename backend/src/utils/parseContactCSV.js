import { parse } from "csv-parse/sync";

export function parseContactCSV(csvText) {
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
  });

  const contactos = [];
  // Ignora contactos anteriores al 6 de mayo de 2025
  const fechaMinima = new Date("2025-06-06");

  for (const row of records) {
    const fechaContacto = new Date(row["Fecha"]);

    if (isNaN(fechaContacto) || fechaContacto < fechaMinima) continue;

    const contacto = {
      email: row["Email"] || row["Customer Email"],
      fecha_contacto: fechaContacto,
      ip: row["IP"],
    };
    // console.log("contacto antes de ser parseado: ", contacto)
    contactos.push(contacto);
  }

  // console.log("contactos parseados:", contactos);
  return contactos;
}
