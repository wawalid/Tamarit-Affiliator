import { parse } from "csv-parse/sync";

export function parseContactCSV(csvText) {
  // console.log("viendo el csv parser: \n", csvText);

  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
  });

  const contactos = [];

  for (const row of records) {
    // console.log("fila: ", row);
    const contacto = {
      email: row["Email"] || row["Customer Email"],
      fecha_contacto: new Date(row["Fecha"]),
      ip: row["IP"],
      // amount: parseFloat(row["Amount"]),
      // currency: row["Currency"],
    };
    
    contactos.push(contacto);
  }
  // console.log("contactos parseados:", contactos);

  return contactos;
}
