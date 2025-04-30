import { Router } from "express";
import {
    createAffiliateLink,
    getAffiliateLinks_user,
    getAffiliateLinks_admin,
    deleteAffiliateLink,
} from "../controllers/affiliate_links.controller.js";
import { authRequired } from "../middlewares/validateToken.js"
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

// Cualquier usuario autenticado
router.post("/create-link", authRequired, createAffiliateLink); // Crear enlace de afiliado para usuarios autenticados
router.get("/links-u", authRequired, getAffiliateLinks_user); // ver los links de afiliado del usuario autenticado

// Solo admins
router.get("/links-a", authRequired, isAdmin, getAffiliateLinks_admin); // ver los links de afiliado de todos los usuarios autenticados
router.delete("/:id", authRequired, isAdmin, deleteAffiliateLink); // Eliminar enlace de afiliado solo para admins

export default router;
