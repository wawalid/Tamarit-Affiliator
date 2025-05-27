import { parse } from "csv-parse/sync";

export function parseContactCSV(csvText) {
  // console.log("viendo el csv parser: \n", csvText);

  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
  });

  const pedidos = [];

  for (const row of records) {
    // console.log("fila: ", row);
    const pedido = {
      order_id: row["Order ID"],
      email: row["Email"] || row["Customer Email"],
      fecha_pedido: new Date(row["Fecha"]),
      ip: row["IP"],
      // amount: parseFloat(row["Amount"]),
      currency: row["Currency"],
    };
    
    pedidos.push(pedido);
  }
  // console.log("Pedidos parseados:", pedidos);

  return pedidos;
}
