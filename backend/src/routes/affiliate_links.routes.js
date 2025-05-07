import { Router } from "express";
import {
    createAffiliateLink,
    getAffiliateLinks,
    deleteAffiliateLink,
} from "../controllers/affiliate_links.controller.js";
import { authRequired } from "../middlewares/validateToken.js"
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

// Cualquier usuario autenticado
router.post("/affiliate_links", authRequired, createAffiliateLink); // Crear enlace de afiliado para usuarios autenticados
router.get("/affiliate_links", authRequired, getAffiliateLinks); // ver los links de afiliado del usuario autenticado, segun si eres admin o no, veras todos los enlaces o no


// wt
router.delete("/affiliate_links/:id", authRequired, isAdmin, deleteAffiliateLink); // Eliminar enlace de afiliado solo para admins

export default router;
