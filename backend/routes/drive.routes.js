import express from "express";
import { authMiddleware } from "../middleware/protect.route.js";
import { startDrive, getDrive, completeRound, startRound } from "../controllers/drive.controller.js";

const router = express.Router();

// POST /drive/start         — create a new drive (4 sessions)
router.post("/start", authMiddleware, startDrive);

// GET  /drive/:id           — get drive state + round statuses + scores
router.get("/:id", authMiddleware, getDrive);

// PATCH /drive/:id/round/:sessionId/start  — mark round as in_progress
router.patch("/:id/round/:sessionId/start", authMiddleware, startRound);

// POST /drive/:id/complete-round           — mark round completed, check drive done
router.post("/:id/complete-round", authMiddleware, completeRound);

export default router;