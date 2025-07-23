import { pool } from "../../../config/db.js"; // Asegúrate de que la ruta es correcta
import fs from 'fs';
//import { EXCEL_FILE_CITAS } from '../utils/pathConstants.js';

export const findPatientById = async (tipoIdentificacion, cedula) => {
    try {
        const [rows] = await pool.query(
            "SELECT nombre FROM pacientes WHERE tipoIdentificacion = ? AND identificacion = ?",
            [tipoIdentificacion, cedula]
        );

        return rows.length > 0 ? rows[0] : null; // Retorna el objeto paciente o null si no existe
    } catch (error) {
        console.error("❌ Error en findPatientById:", error);
        throw error; // Se lanza el error para que el controlador lo maneje
    }
};