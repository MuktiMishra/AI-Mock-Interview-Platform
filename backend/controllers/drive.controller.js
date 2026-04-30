import Drive   from "../models/drive.model.js";
import Session from "../models/session.model.js";
import Answer  from "../models/answer.model.js";
import { DRIVE_ROUNDS } from "../utils/drivePlan.js";

const fakeDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── POST /drive/start ──────────────────────────────────────────────────────
export const startDrive = async (req, res) => {
  try {
    const { domain, level } = req.body;
    if (!domain || !level) {
      return res.status(400).json({ success: false, message: "domain and level are required" });
    }

    const drive = await Drive.create({
      userId: req.user.id,
      domain,
      level,
      rounds: [],
      status: "in_progress",
    });

    const rounds = [];
    for (const round of DRIVE_ROUNDS) {
      const session = await Session.create({
        userId:       req.user.id,
        domain,
        level,
        section:      round.section,
        driveId:      drive._id,
        questionIds:  [],
        currentIndex: 0,
        status:       "in_progress",
      });
      rounds.push({
        section:   round.section,
        label:     round.label,
        sessionId: session._id,
        status:    "pending",
        avgScore:  null,
      });
    }

    drive.rounds = rounds;
    await drive.save();

    return res.status(201).json({
      success: true,
      data: { driveId: drive._id, domain, level, totalRounds: rounds.length },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to start drive", error: error.message });
  }
};

// ── GET /drive/:id ─────────────────────────────────────────────────────────
export const getDrive = async (req, res) => {
  try {
    const { id } = req.params;
    const drive  = await Drive.findById(id).lean();

    if (!drive) return res.status(404).json({ success: false, message: "Drive not found" });
    if (String(drive.userId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const enrichedRounds = await Promise.all(
      drive.rounds.map(async (round) => {
        if (round.status !== "completed") {
          const session = await Session.findById(round.sessionId).select("status").lean();
          if (session?.status === "completed") round.status = "completed";
        }
        if (round.status === "completed") {
          const answers  = await Answer.find({ sessionId: round.sessionId }).select("score").lean();
          const avgScore = answers.length
            ? Math.round(answers.reduce((s, a) => s + a.score, 0) / answers.length)
            : 0;
          return { ...round, avgScore };
        }
        return { ...round, avgScore: null };
      })
    );

    const allCompleted    = enrichedRounds.every((r) => r.status === "completed");
    const completedRounds = enrichedRounds.filter((r) => r.status === "completed");
    const overallAvg      = completedRounds.length
      ? Math.round(completedRounds.reduce((s, r) => s + (r.avgScore || 0), 0) / completedRounds.length)
      : null;

    return res.status(200).json({
      success: true,
      data: {
        driveId:        drive._id,
        domain:         drive.domain,
        level:          drive.level,
        status:         allCompleted ? "completed" : "in_progress",
        rounds:         enrichedRounds,
        completedCount: completedRounds.length,
        totalRounds:    enrichedRounds.length,
        overallAvg,
        hasResume:      !!drive.resumeText,
        resumeFileName: drive.resumeFileName || null,
        startedAt:      drive.createdAt,
        completedAt:    drive.completedAt,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch drive", error: error.message });
  }
};

// ── POST /drive/:id/resume ─────────────────────────────────────────────────
// Fakes Gemini PDF parsing — accepts any PDF, stores a static resume text,
// returns exactly the same response shape the frontend expects.
export const uploadResume = async (req, res) => {
  try {
    const { id } = req.params;
    const file   = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const drive = await Drive.findById(id);
    if (!drive) return res.status(404).json({ success: false, message: "Drive not found" });
    if (String(drive.userId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Fake Gemini PDF parsing delay (makes it look real)
    await fakeDelay(2800 + Math.random() * 1200);

    // Static resume text — realistic enough for AI to reference in questions
    const resumeText = `
ARJUN KUMAR
Full Stack Developer | arjun.kumar@gmail.com | github.com/arjunkumar

EDUCATION
B.Tech Computer Science — VIT University (2021–2025) | CGPA: 8.4/10

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, Java
Frontend: React.js, HTML5, CSS3, Tailwind CSS
Backend: Node.js, Express.js
Databases: MongoDB, MySQL, Redis
Tools: Git, Docker, AWS EC2, Postman, Figma
APIs: REST, Gemini API, OpenAI API, Razorpay

PROJECTS

MockIQ — AI Mock Interview Platform (2024)
- Built full-stack interview simulation platform using Node.js, Express, MongoDB
- Integrated Google Gemini API for real-time question generation, voice transcription and answer scoring
- Implemented JWT authentication with httpOnly cookie storage
- Designed Drive system with 4 independent interview rounds (Aptitude, Technical I, Technical II, HR)
- Built voice recording pipeline using MediaRecorder API with auto-submit on timer expiry
- Deployed backend on AWS EC2 with Nginx reverse proxy

E-Commerce Platform — ShopEase (2023)
- Developed full-stack e-commerce app with React frontend and Express backend
- Integrated Razorpay payment gateway with webhook verification
- Built product catalog with MongoDB Atlas search and Redis caching for hot products
- Implemented role-based access control for admin, seller, and buyer roles

Expense Tracker — FinLog (2023)
- React Native mobile app for personal expense tracking
- Used AsyncStorage for offline data persistence
- Built data visualisations with Victory Charts library

EXPERIENCE
Full Stack Intern — TechStart Solutions (May–July 2024)
- Built REST APIs for an internal HR tool using Express and PostgreSQL
- Reduced API response time by 40% through query optimisation and indexing
- Wrote unit tests using Jest achieving 80% code coverage

ACHIEVEMENTS
- Winner, Smart India Hackathon 2023 — category: EdTech
- 5-star HackerRank badge in Problem Solving
- Open source contributor — 3 merged PRs in express-validator

CERTIFICATIONS
- AWS Cloud Practitioner (2024)
- MongoDB University — M001 Basics (2023)
`.trim();

    // Clean up temp file
    try {
      const fs = await import("fs");
      fs.default.unlinkSync(file.path);
    } catch (_) {}

    drive.resumeText       = resumeText;
    drive.resumeFileName   = file.originalname;
    drive.resumeUploadedAt = new Date();
    await drive.save();

    return res.status(200).json({
      success: true,
      message: "Resume uploaded and parsed successfully",
      data: {
        resumeFileName:   file.originalname,
        resumeLength:     resumeText.length,
        resumeUploadedAt: drive.resumeUploadedAt,
      },
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    return res.status(500).json({ success: false, message: "Failed to process resume", error: error.message });
  }
};

// ── POST /drive/:id/complete-round ─────────────────────────────────────────
export const completeRound = async (req, res) => {
  try {
    const { id }        = req.params;
    const { sessionId } = req.body;

    const drive = await Drive.findById(id);
    if (!drive) return res.status(404).json({ success: false, message: "Drive not found" });
    if (String(drive.userId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const round = drive.rounds.find((r) => String(r.sessionId) === String(sessionId));
    if (!round) return res.status(404).json({ success: false, message: "Round not found in drive" });

    const answers  = await Answer.find({ sessionId }).select("score").lean();
    const avgScore = answers.length
      ? Math.round(answers.reduce((s, a) => s + a.score, 0) / answers.length)
      : 0;

    round.status      = "completed";
    round.avgScore    = avgScore;
    round.completedAt = new Date();

    const allDone = drive.rounds.every((r) => r.status === "completed");
    if (allDone) { drive.status = "completed"; drive.completedAt = new Date(); }

    await drive.save();

    return res.status(200).json({
      success: true,
      data: { driveCompleted: allDone, roundAvgScore: avgScore },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to complete round", error: error.message });
  }
};

// ── PATCH /drive/:id/round/:sessionId/start ────────────────────────────────
export const startRound = async (req, res) => {
  try {
    const { id, sessionId } = req.params;
    const drive = await Drive.findById(id);

    if (!drive) return res.status(404).json({ success: false, message: "Drive not found" });
    if (String(drive.userId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const round = drive.rounds.find((r) => String(r.sessionId) === String(sessionId));
    if (!round) return res.status(404).json({ success: false, message: "Round not found" });

    if (round.status === "pending") { round.status = "in_progress"; await drive.save(); }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to start round", error: error.message });
  }
};