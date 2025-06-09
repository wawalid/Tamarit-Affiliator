// esto era un ruta para poder meter en la bd todos los articulos de la pagina de tamarit, pero no lo veia necesario ni era el momento porque tenia otras cosas mas importantes que hacer

import { createAccessory, getAccessories } from "../controllers/accessory.controller.js";
import { Router } from "express";

const router = Router()

router.get("/accessories", getAccessories);
router.post("/accessories", createAccessory);


export default router;