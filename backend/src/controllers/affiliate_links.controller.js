import EnlaceAfiliado from "../models/affiliate_link.model.js";
import User from "../models/user.model.js";

export const createAffiliateLink = async (req, res) => {
    try {
        const { nombre_enlace, enlace_original, enlace_utm, codigo_descuento } = req.body;

        if (!nombre_enlace || !enlace_original || !enlace_utm || !codigo_descuento) {
            return res.status(400).json(["Missing required fields"]);
        }

        const newEnlace = new EnlaceAfiliado({
            user: req.user.id,
            nombre_enlace,
            enlace_original,
            enlace_utm,
            codigo_descuento,
        });
        

        const savedEnlace = await newEnlace.save();
        res.json(savedEnlace);
    } catch (error) {
        return res.status(500).json(error.message);
    }        
};

//este es el que se usa para ver los enlaces de afiliado del usuario autenticado, segun si eres admin o no, veras todos los enlaces o no
export const getAffiliateLinks = async (req, res) => {
    try {
        const enlaces = await EnlaceAfiliado.find({ user: req.user.id }).populate("user");
        res.json(enlaces);
        console.log("usuario es admin", req.user)
    } catch (error) {
        return res.status(500).json(["Error retrieving affiliate links"]);
    }
};

// export const getAffiliateLink = async (req, res) => {
//     try {
//         const { id } = req.params;

//         let enlace;

//         // Si el usuario es administrador, puede ver cualquier enlace
//         if (req.user.is_admin) {
//             enlace = await EnlaceAfiliado.findById(id).populate("user");
//         } else {
//             // Si no, solo puede ver sus propios enlaces
//             enlace = await EnlaceAfiliado.findOne({ _id: id, user: req.user.id }).populate("user");
//         }

//         if (!enlace) return res.status(404).json(["Affiliate link not found"]);

//         res.json(enlace);
//     } catch (error) {
//         return res.status(500).json(["Error retrieving affiliate link"]);
//     }
// };


export const deleteAffiliateLink = async (req, res) => {
    try {
        const { id } = req.params;
        const enlace = await EnlaceAfiliado.findById(id);

        if (!enlace) return res.status(404).json(["Affiliate link not found"]);

        if (enlace.user.toString() !== req.user.id && !req.user.is_admin) {
            return res.status(403).json(["You are not authorized to delete this link"]);
        }

        await enlace.deleteOne();
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json(["Error deleting affiliate link"]);
    }
};
