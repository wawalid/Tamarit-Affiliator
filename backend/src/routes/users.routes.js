import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {adminRequired} from "../middlewares/adminRequired.js"
import { getUsers } from "../controllers/users.controller.js";

const router = Router()

router.get("/users", authRequired, adminRequired, getUsers)


export default router 