import { Router } from "express";
import {
    createAffiliateLink,
    getAffiliateLinksByUserId,
    getAffiliateLinks,
    deleteAffiliateLink,
} from "../controllers/affiliate_links.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { affiliateLinkSchema } from "../schemas/affiliate_link.js";
import { authRequired } from "../middlewares/validateToken.js"
import { adminRequired } from "../middlewares/adminRequired.js";

const router = Router();

// Cualquier usuario autenticado
router.get("/affiliate_links", authRequired, getAffiliateLinks); // ver los links de afiliado del usuario autenticado, segun si eres admin o no, veras todos los enlaces o no
router.get("/affiliate_links/:id", authRequired, adminRequired, getAffiliateLinksByUserId); 
router.post("/affiliate_links", authRequired, validateSchema(affiliateLinkSchema),createAffiliateLink); // Crear enlace de afiliado para usuarios autenticados


// wt
router.delete("/affiliate_links/:id", authRequired, adminRequired, deleteAffiliateLink); // Eliminar enlace de afiliado solo para admins

export default router;
