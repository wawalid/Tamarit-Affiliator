import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Base de datos conectada con éxito");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1); // Cierra la app si falla la conexión
  }
};
