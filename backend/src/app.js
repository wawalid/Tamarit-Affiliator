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

const app = express()

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.0.27:5173",  
];

app.use(cors({
  origin: function(origin, callback) {
    // permitir solicitudes sin origen (como herramientas tipo Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
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


export default app;

