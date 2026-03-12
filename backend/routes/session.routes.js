import express from "express";
import { startSession } from "../controllers/session.controller.js";
import { authMiddleware } from "../middleware/protect.route.js";
import { getCurrentQuestion } from "../controllers/get.current.question.js";
import { getSessionSummary } from "../controllers/get.session.summary.js";
import { getSessionAnswers } from "../controllers/get.session.answers.js";
import { submitAnswer } from "../controllers/submit.answer.js";
import upload from "../middleware/upload.middleware.js";



const router = express.Router();

router.post("/start", authMiddleware, startSession);
router.get("/:id/current", authMiddleware, getCurrentQuestion);
router.post("/:id/answer", authMiddleware, upload.single("audio"), submitAnswer);
router.get("/:id/summary", authMiddleware, getSessionSummary);
router.get("/:id/answers", authMiddleware, getSessionAnswers);

export default router;

