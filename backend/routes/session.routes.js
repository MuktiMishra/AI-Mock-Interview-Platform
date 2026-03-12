import express from "express";
import { startSession } from "../controllers/session.controller.js";
import { authMiddleware } from "../middleware/protect.route.js";
import { getCurrentQuestion } from "../controllers/get.current.question.js";
import { submitAnswer } from "../controllers/submit.answer.js";

const router = express.Router();

router.post("/start", authMiddleware, startSession);
router.get("/:id/current", authMiddleware, getCurrentQuestion);
router.post("/:id/answer", authMiddleware, submitAnswer);

export default router;