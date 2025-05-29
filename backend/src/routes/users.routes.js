import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {adminRequired} from "../middlewares/adminRequired.js"
import { getUsers,getUserbyID, updateActiveUser } from "../controllers/users.controller.js";

const router = Router()

router.get("/users", authRequired, adminRequired, getUsers)
router.get("/users/:id", authRequired, adminRequired, getUserbyID)
router.put("/users/:id", authRequired, adminRequired, updateActiveUser)


export default router 