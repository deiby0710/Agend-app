import { Router } from "express";
import { searchPatient  } from "./controller.js"; 

const router = Router();

router.post("/buscar", searchPatient);

export default router;
