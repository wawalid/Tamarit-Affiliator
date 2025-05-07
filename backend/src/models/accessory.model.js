import mongoose from "mongoose";

const accessorySchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true,
    },
    descuento: {
        type: Number,
        default: 0,
    },
    enlace: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Accessory', accessorySchema);
