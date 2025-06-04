import { parse } from "csv-parse/sync";

export function parseContactCSV(csvText) {
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
  });

  const contactos = [];
  const fechaMinima = new Date("2025-05-01");

  for (const row of records) {
    const fechaContacto = new Date(row["Fecha"]);

    // Ignora contactos anteriores al 1 de mayo de 2025
    if (isNaN(fechaContacto) || fechaContacto < fechaMinima) continue;

    const contacto = {
      email: row["Email"] || row["Customer Email"],
      fecha_contacto: fechaContacto,
      ip: row["IP"],
    };
    console.log("contacto antes de ser parseado: ", contacto)
    contactos.push(contacto);
  }

  console.log("contactos parseados:", contactos);
  return contactos;
}
