import express from "express";
import cors from "cors";
import patientsRoutes from "./src/modules/patients/routes.js"; 
import appointmentRoutes from "./src/modules/appointments/routes.js"; 
import smsRoutes from "./src/modules/sms/routes.js"; 

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/pacientes", patientsRoutes);
app.use("/api/citas", appointmentRoutes);
app.use("/api/enviar-sms", smsRoutes);

app.listen(5173, '0.0.0.0', () => {
    console.log("Servidor corriendo en http://190.147.27.194:5173");
});
