import fs from 'fs';
import { EXCEL_FILE_CITAS } from '../../utils/pathConstants.js';

export function verificarArchivoCitas() {
    return fs.existsSync(EXCEL_FILE_CITAS)
}

export function obtenerRutaArchivoCitas(){
    return EXCEL_FILE_CITAS
}