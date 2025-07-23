import { 
    findAvailableAppointments, 
    sendAppointment, 
    changeStateAppointment, 
    showAppointments, 
    validateAppointment
} from "./service.js";

export const getAvailableAppointments = async (req, res) => {
    try {
        const { fecha, sede } = req.body;
        if (!fecha || !sede) {
            return res.status(400).json({ error: "La fecha y la sede son obligatorias" });
        }
        const horariosDisponibles = await findAvailableAppointments(fecha, sede);
        res.json({ horariosDisponibles });
    } catch (error) {
        console.error("❌ Error en getAvailableAppointments:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const createAppointment = async (req, res) => {
    try {
        const { nombre, tipo, documento, celular, horario, sede } = req.body;
        if (!nombre || !tipo || !documento || !celular || !horario || !sede) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }
        const result = await sendAppointment(nombre, tipo, documento, celular, horario, sede);
        if (result.success) {
            res.status(201).json({ message: "Cita registrada exitosamente", citaId: result.citaId });
        } else {
            res.status(400).json({ error: result.message });
        }
    } catch (error) {
        console.error("❌ Error en createAppointment:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const changeStateAppointmentController = async (req, res) => {
    try {
        const { id, estado } = req.body;
        if (!id || !estado) return res.status(400).json({ error: "El id y el estado son obligatorios" });
        const result = await changeStateAppointment(id, estado);
        if (result.success) {
            res.status(201).json({ message: "Estado de la cita cambiado exitosamente" });
        } else {
            res.status(400).json({ error: result.message });
        }
    } catch (error) {
        console.log("❌ Error en changeStateAppointmentController:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const showAppointmentsController = async (req, res) => {
    try {
        const { fecha, sede } = req.body;
        if (!fecha) return res.status(400).json({ error: "La fecha es obligatoria" });
        if (!sede) return res.status(400).json({ error: "La sede es obligatoria" });

        const result = await showAppointments(fecha, sede); // 👈 pásale sede al servicio
        if (result.success) {
            return res.status(200).json({
                message: "Citas obtenidas correctamente.",
                data: result.data
            });
        } else {
            res.status(404).json({ error: result.message });
        }
    } catch (error) {
        console.log("❌ Error en showAppointmentsController:", error);
        res.status(500).json({ error: "Error interno del servidor"});
    };
};

export const validateAppointmentController = async (req, res) => {
    const { documento, tipo } = req.body;
    if (!documento || !tipo) {
        return res.status(400).json({ success: false, error: "Faltan datos para validar la cita" });
    }
    try {
        const result = await validateAppointment(documento, tipo);
        if (result.success && result.data.length > 0) {
            return res.status(200).json({
                success: true,
                tieneCita: true,
                cita: result.data[0]
            });
        } else {
            return res.status(200).json({ success: true, tieneCita: false });
        }
    } catch (error) {
        console.error("❌ Error en validateAppointmentController:", error);
        return res.status(500).json({ success: false, error: "Error al validar cita" });
    }
};

