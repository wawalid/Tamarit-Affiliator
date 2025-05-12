import express from 'express';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import cors from 'cors';

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/tasks.routes.js";
import affiliateLinksRoutes from "./routes/affiliate_links.routes.js";
import accessoryRoutes from "./routes/accessory.routes.js";
import usersRoutes from "./routes/users.routes.js"

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
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


export default app;

