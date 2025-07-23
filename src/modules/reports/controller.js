import {
    verificarArchivoCitas,
    obtenerRutaArchivoCitas
} from './service.js'

export function descargarArchivoCitas(req, res) {
    try {
        if(verificarArchivoCitas()){
            const rutaArchivo = obtenerRutaArchivoCitas();

            res.download(rutaArchivo, 'reporte_citas.xlsx',(err) => {
                if (err) {
                    console.error('Error al descargar: ', err)
                    res.status(500).send('Error al descargar el archivo.')
                }
            });
        } else {
            res.status(400).send("Archivo no encontrado.")
        }
    } catch (error) {
        console.error('Error inesperado: ', error);
        res.status(500).send('Error interno del servidor.')
    }
}