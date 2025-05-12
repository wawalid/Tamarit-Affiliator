import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {isAdmin} from "../middlewares/isAdmin.js"
import { getUsers } from "../controllers/users.controller.js";

const router = Router()

router.get("/users", authRequired, isAdmin, getUsers)


export default router 