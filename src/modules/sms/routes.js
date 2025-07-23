import express from "express";
import { sendSMSController } from "./controller.js";

const router = express.Router();

router.post("/", sendSMSController);

export default router;
