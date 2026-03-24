import express from "express";
import { signup, login, getMe } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/protect.route.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);

export default router;