import express from "express";
import cors from "cors";
import patientsRoutes from "./src/modules/patients/routes.js"; 
import appointmentRoutes from "./src/modules/appointments/routes.js"; 
import smsRoutes from "./src/modules/sms/routes.js"; 
import reportRoutes from './src/modules/reports/routes.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/pacientes", patientsRoutes);
app.use("/api/citas", appointmentRoutes);
app.use("/api/enviar-sms", smsRoutes);
app.use("/api/reporte",reportRoutes);

app.listen(3000, '0.0.0.0', () => {
    console.log("Servidor corriendo en http://localhost:3000");
});