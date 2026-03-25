import express from "express";
import { getReport, startSession } from "../controllers/session.controller.js";
import { authMiddleware } from "../middleware/protect.route.js";
import { getCurrentQuestion } from "../controllers/get.current.question.js";
import { getSessionSummary } from "../controllers/get.session.summary.js";
import { getSessionAnswers } from "../controllers/get.session.answers.js";
import { submitAnswer } from "../controllers/submit.answer.js";
import upload from "../middleware/upload.middleware.js";
import { getUserSessions } from "../controllers/user.controller.js";



const router = express.Router();

router.post("/start", authMiddleware, startSession);
router.get("/:id/current", getCurrentQuestion);
router.post("/:id/answer", upload.single("audio"), authMiddleware, submitAnswer);
router.get("/:id/summary", getSessionSummary);
router.get("/:id/answers", getSessionAnswers);
router.get("/:id/report", getReport);
router.get("/sessions", authMiddleware, getUserSessions);

export default router;

