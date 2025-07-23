import { Router } from "express";
import { descargarArchivoCitas } from "./controller.js";

const router = Router()

router.get('/citas',descargarArchivoCitas)

export default router;