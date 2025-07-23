import { findPatientById } from "./service.js";


export const searchPatient = async (req, res) => {
    const { tipoIdentificacion, cedula } = req.body;

    if (!tipoIdentificacion || !cedula) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        const patient = await findPatientById(tipoIdentificacion, cedula);

        if (!patient) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }

        res.json({ nombre: patient.nombre });
    } catch (error) {
        console.error("Error en searchPatient:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};