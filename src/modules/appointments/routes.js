import { Router } from "express";
import { getAvailableAppointments,createAppointment, changeStateAppointmentController,showAppointmentsController, validateAppointmentController } from "./controller.js"; 

const router = Router();

router.post("/horariosDisponibles", getAvailableAppointments);
router.post("/agendarCita", createAppointment);
router.post("/cambiarEstado", changeStateAppointmentController);
router.post("/mostrar", showAppointmentsController);
router.post("/validarCita", validateAppointmentController);


export default router;
