import express from "express";
import { startSession } from "../controllers/session.controller.js";
import { authMiddleware } from "../middleware/protect.route.js";

const router = express.Router();

router.post("/start", authMiddleware, startSession);

export default router;