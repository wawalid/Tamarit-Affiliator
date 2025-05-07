import { createAccessory, getAccessories } from "../controllers/accessory.controller.js";
import { Router } from "express";

const router = Router()

router.get("/accessories", getAccessories);
router.post("/accessories", createAccessory);


export default router;