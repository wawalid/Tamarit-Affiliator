import express from 'express';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import cors from 'cors';

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/tasks.routes.js";
import affiliateLinksRoutes from "./routes/affiliate_links.routes.js";
import accessoryRoutes from "./routes/accessory.routes.js";
import usersRoutes from "./routes/users.routes.js"
import adminRoutes from "./routes/admin.routes.js";
import systemInfoRoutes from "./routes/system_info.routes.js";

const app = express();

// 👇 Añade aquí tu dominio de frontend en producción
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.1.146:5173",
  // "http://192.168.0.27:5173",
  "https://front-production-aa1f.up.railway.app" // <-- ¡este es el que faltaba!
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // permite herramientas como Postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("No permitido por CORS: " + origin));
    }
  },
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", taskRoutes);
app.use("/api", affiliateLinksRoutes);
app.use("/api", accessoryRoutes);
app.use("/api", usersRoutes);
app.use("/api", adminRoutes);
app.use("/api", systemInfoRoutes);

export default app;
