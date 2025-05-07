import Accessory from "../models/accessory.model.js";

export const createAccessory = async (req, res) => {
    try {
        const { nombre, precio, enlace } = req.body;

        if (!nombre || !precio || !enlace) {
            return res.status(400).json(["Missing required fields"]);
        }

        const newAccessory = new Accessory({
            nombre,
            precio,
            enlace,
        });

        const savedAccessory = await newAccessory.save();
        res.json(savedAccessory);
    } catch (error) {
        return res.status(500).json(["Error creating accessory"]);
    }
}

export const getAccessories = async (req, res) => {
    try {
        const accessories = await Accessory.find();
        res.json(accessories);
    } catch (error) {
        return res.status(500).json(["Error retrieving accessories"]);
    }
}