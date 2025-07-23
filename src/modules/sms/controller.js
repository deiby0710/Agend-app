import { sendSMSService } from "./service.js";

export const sendSMSController = async (req, res) => {
    const { numero, mensaje } = req.body;

    if (!numero || !mensaje) {
        return res.status(400).json({ success: false, error: "Número y mensaje son requeridos" });
    }

    try {
        const result = await sendSMSService(numero, mensaje);
        res.json({ success: true, resultado: result });
    } catch (error) {
        console.error("❌ Error al enviar SMS:", error.response?.data || error.message);
        res.status(500).json({ success: false, error: error.response?.data || "Error interno del servidor" });
    }
};
