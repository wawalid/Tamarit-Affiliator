import { authRequired } from "../middlewares/validateToken.js";
import {adminRequired} from "../middlewares/adminRequired.js"
import {getSystemInfo} from "../controllers/system_info.controller.js";
import { Router } from "express";

const router = Router()


router.get("/get_system_info", authRequired, adminRequired, getSystemInfo)

export default router