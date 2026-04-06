import Drive   from "../models/drive.model.js";
import Session from "../models/session.model.js";
import Answer  from "../models/answer.model.js";
import fs      from "fs";
import model   from "../utils/geminiClient.js";
import { DRIVE_ROUNDS } from "../utils/drivePlan.js";

// ── POST /drive/start ──────────────────────────────────────────────────────
export const startDrive = async (req, res) => {
  try {
    const { domain, level } = req.body;

    if (!domain || !level) {
      return res.status(400).json({ success: false, message: "domain and level are required" });
    }

    // Create the Drive shell first so we have its _id for session.driveId
    const drive = await Drive.create({
      userId: req.user.id,
      domain,
      level,
      rounds:  [],
      status:  "in_progress",
    });

    // Create one Session per round, each stamped with section + driveId
    const rounds = [];
    for (const round of DRIVE_ROUNDS) {
      const session = await Session.create({
        userId:       req.user.id,
        domain,
        level,
        section:      round.section,   // ← key addition
        driveId:      drive._id,       // ← key addition
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
        // Safety net — sync from session if needed
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

    const allCompleted     = enrichedRounds.every((r) => r.status === "completed");
    const completedRounds  = enrichedRounds.filter((r) => r.status === "completed");
    const overallAvg       = completedRounds.length
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
// Accepts a PDF upload, extracts text via Gemini, stores on Drive document.
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

    // Extract text from PDF using Gemini vision
    const pdfBuffer  = fs.readFileSync(file.path);
    const pdfBase64  = pdfBuffer.toString("base64");

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data:     pdfBase64,
        },
      },
      {
        text: `Extract all text from this resume PDF. 
Return the raw text content only — no formatting, no markdown, no commentary.
Preserve section headings, job titles, company names, skills, and project descriptions as faithfully as possible.`,
      },
    ]);

    const resumeText = result.response.text().trim();

    if (!resumeText || resumeText.length < 50) {
      return res.status(422).json({
        success: false,
        message: "Could not extract meaningful text from the PDF. Please try a text-based PDF.",
      });
    }

    // Clean up temp file
    try { fs.unlinkSync(file.path); } catch (_) {}

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