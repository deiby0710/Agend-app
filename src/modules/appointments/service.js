import { pool } from "../../../config/db.js"; // Asegúrate de que la ruta es correcta
import { getConnection } from "../../../config/db.js";
//import fs from 'fs';
//import { EXCEL_FILE_CITAS } from '../utils/pathConstants.js';

const HORARIOS_POSIBLES = (() => {
    let horarios = [];
    
    function agregarHorarios(inicio, fin, intervalo) {
        let hora = new Date(`1970-01-01T${inicio}:00`);
        let horaLimite = new Date(`1970-01-01T${fin}:00`);

        while (hora <= horaLimite) {
            horarios.push(hora.toTimeString().substring(0, 5)); // "HH:MM"
            hora.setMinutes(hora.getMinutes() + intervalo);
        }
    }

    // Mañana: 07:30 AM - 11:30 AM (Cada 15 minutos)
    agregarHorarios("07:30", "11:50", 10);

    // Tarde: 02:00 PM - 05:00 PM (Cada 15 minutos)
    agregarHorarios("14:00", "16:50", 10);

    return horarios;
})();

// Encontrar una cita disponible
export const findAvailableAppointments = async (fecha, sede) => {
    try {
        const [rows] = await pool.query(
            "SELECT TIME(horario) AS horario FROM citas WHERE DATE(horario) = ? AND sede = ? AND estado IN ('P','NA','A')",
            [fecha, sede]
        );

        const horariosOcupados = rows.map(row => row.horario.substring(0, 5));

        const horariosDisponibles = HORARIOS_POSIBLES.filter(
            hora => !horariosOcupados.includes(hora)
        );

        return horariosDisponibles;
    } catch (error) {
        console.error("❌ Error en findAvailableAppointments:", error);
        throw error;
    }
};

// Enviar datos de cita
export const sendAppointment = async (nombre, tipo, documento, celular, horario, sede) => {
    try {
        const [result] = await pool.query(
            "INSERT INTO citas (nombre, tipo, documento, celular, horario, sede) VALUES (?, ?, ?, ?, ?, ?)",
            [nombre, tipo, documento, celular, horario, sede]
        );
        return { success: true, citaId: result.insertId };
    } catch (error) {
        console.error("❌ Error en sendAppointment:", error);
        return { success: false, message: "Error al registrar la cita." };
    }
};

// Cancelar cita
export const changeStateAppointment = async (id, state) => {
    try {
        const [result] = await pool.query(
            `UPDATE citas SET estado=? WHERE idcitas=?;`,
            [state, id]
        );
        return { success: true }
    } catch (error) {
        console.log("❌ Error en changeStateAppointment:", error);
        return { success: false, message: "Error al cambiar estado de la cita."}
    }
};

// Mostrar citas con filtro por fecha, estado 'P' y sede
export const showAppointments = async (fecha, sede) => {
    try {
        const [result] = await pool.query(
            "SELECT idcitas, nombre, tipo, documento, celular, horario FROM citas WHERE DATE(horario)=? AND estado='P' AND sede=?;",
            [fecha, sede]
        );
        return { success: true, data: result };
    } catch (error) {
        console.log("❌ Error en showAppointments:", error);
        return { success: false, message: "Error al mostrar las citas disponibles" };
    }
};

// Validar cita
export const validateAppointment = async (documento,tipo) => {
    try {
        const [result] = await pool.query(
            "SELECT * FROM citas where documento=? and tipo=? and estado='P';",
            [documento,tipo]
        );
        if (result.length > 0) {
            return { success: true, data: result }
        } else {
            return { success: false }
        }
    } catch (error) {
        console.log("❌ Error en validateAppointment:", error);
        return {success: false, message: "Error al validar cita del paciente"}
    }
};


//export function verificarArchivoCitas() {
  //  return fs.existsSync(EXCEL_FILE_CITAS);
  //}
  
  //export function obtenerRutaArchivoCitas() {
   // return EXCEL_FILE_CITAS;
  //}