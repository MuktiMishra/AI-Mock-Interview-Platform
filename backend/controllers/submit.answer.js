import Session  from "../models/session.model.js";
import Question from "../models/question.model.js";
import Answer   from "../models/answer.model.js";
import Drive    from "../models/drive.model.js";
import { STATIC_QUESTIONS, STATIC_SCORES, STATIC_TRANSCRIPTS, pickRandomIndex } from "./get.current.question.js";

// ── Fake delay ─────────────────────────────────────────────────────────────
const fakeDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Get static score for this section + question index ─────────────────────
const getStaticScore = (section, index) => {
  const scores = STATIC_SCORES[section] || STATIC_SCORES.technical1;
  return scores[index % scores.length];
};

// ── Get static transcript for voice sections ───────────────────────────────
const getStaticTranscript = (section, index) => {
  if (section === "aptitude") return null; // MCQ, no transcript needed
  const transcripts = STATIC_TRANSCRIPTS[section] || STATIC_TRANSCRIPTS.technical1;
  return transcripts[index % transcripts.length];
};

// ── Notify drive round complete ────────────────────────────────────────────
const notifyDriveRoundComplete = async (driveId, sessionId, answers) => {
  if (!driveId) return;
  try {
    const drive = await Drive.findById(driveId);
    if (!drive) return;
    const round = drive.rounds.find((r) => String(r.sessionId) === String(sessionId));
    if (!round) return;
    const avgScore = answers.length
      ? Math.round(answers.reduce((s, a) => s + a.score, 0) / answers.length)
      : 0;
    round.status      = "completed";
    round.avgScore    = avgScore;
    round.completedAt = new Date();
    const allDone = drive.rounds.every((r) => r.status === "completed");
    if (allDone) { drive.status = "completed"; drive.completedAt = new Date(); }
    await drive.save();
  } catch (err) {
    console.error("Drive notify failed:", err);
  }
};

// ── Main controller ────────────────────────────────────────────────────────
export const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, selectedOption } = req.body;
    const driveId = req.query.driveId || req.body.driveId || null;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ success: false, message: "Session already completed" });
    }

    const currentQuestionId = session.questionIds[session.currentIndex];
    if (!currentQuestionId) {
      session.status      = "completed";
      session.completedAt = new Date();
      await session.save();
      return res.status(200).json({ success: true, data: { completed: true } });
    }

    const questionDoc = await Question.findById(currentQuestionId).lean();
    const section     = questionDoc?.section || session.section || "technical1";
    const isAptitude  = section === "aptitude";
    const answerIndex = session.currentIndex;

    // ── Fake the AI evaluation delay ──
    const delayMs = isAptitude
      ? 600  + Math.random() * 400
      : 2500 + Math.random() * 1500;
    await fakeDelay(delayMs);

    // ── Get score ──
    const score = getStaticScore(section, answerIndex);

    // ── Get transcript ──
    const transcript = isAptitude
      ? `Selected: ${selectedOption || "none"}`
      : getStaticTranscript(section, answerIndex);

    // ── Persist answer ──
    const file = req.file;
    await Answer.create({
      sessionId:  session._id,
      questionId: currentQuestionId,
      userId:     req.user.id,
      transcript: transcript || "",
      score,
      metrics: { fillerCount: 0, wpm: 0 },
      audio: file
        ? { fileName: file.filename, mimeType: file.mimetype, sizeBytes: file.size, durationSec: 0, path: file.path }
        : { fileName: "", mimeType: "", sizeBytes: 0, durationSec: 0, path: "" },
    });

    // ── Advance index ──
    session.currentIndex += 1;
    const TOTAL_QUESTIONS = 10;

    if (session.currentIndex >= TOTAL_QUESTIONS) {
      session.status      = "completed";
      session.completedAt = new Date();
      await session.save();

      const allAnswers = await Answer.find({ sessionId: session._id }).select("score").lean();
      const sessionDriveId = driveId || session.driveId;
      if (sessionDriveId) {
        await notifyDriveRoundComplete(sessionDriveId, session._id, allAnswers);
      }

      return res.status(200).json({
        success: true,
        data: { completed: true, score },
      });
    }

    await session.save();

    // ── Generate next random question (no repeats) ──
    const QUESTION_PLAN = ["aptitude", "technical1", "technical2", "coding", "hr"];
    const nextSection   = session.section || QUESTION_PLAN[session.currentIndex % QUESTION_PLAN.length];

    const bank = STATIC_QUESTIONS[nextSection] || STATIC_QUESTIONS.technical1;

    // Collect already-used question texts to avoid repeats
    const existingQuestions = await Question.find({ _id: { $in: session.questionIds } }).select("text").lean();
    const usedTexts = existingQuestions.map((q) => q.text);

    // Fake AI question generation delay
    await fakeDelay(1200 + Math.random() * 800);

    const nextIdx = pickRandomIndex(bank, usedTexts);
    const staticQ = bank[nextIdx];

    const newQuestion = await Question.create({
      domain:           session.domain,
      level:            session.level,
      section:          nextSection,
      text:             staticQ.text,
      options:          staticQ.options       || [],
      correctAnswer:    staticQ.correctAnswer || null,
      tags:             staticQ.tags,
      expectedKeywords: staticQ.expectedKeywords,
      rubric:           staticQ.rubric,
    });

    session.questionIds.push(newQuestion._id);
    await session.save();

    return res.status(200).json({
      success: true,
      data: {
        completed:      false,
        score,
        currentIndex:   session.currentIndex,
        totalQuestions: TOTAL_QUESTIONS,
        section:        nextSection,
        question:       newQuestion,
      },
    });
  } catch (error) {
    console.error("submitAnswer error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit answer",
      error: error.message,
    });
  }
};