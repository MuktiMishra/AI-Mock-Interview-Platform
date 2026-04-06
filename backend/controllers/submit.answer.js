import Session  from "../models/session.model.js";
import Question from "../models/question.model.js";
import Answer   from "../models/answer.model.js";
import Drive    from "../models/drive.model.js";
import fs       from "fs";
import model    from "../utils/geminiClient.js";
import { generateQuestion } from "./get.current.question.js";
import dotenv   from "dotenv";
dotenv.config();

// ── Score an open-ended voice answer via Gemini ────────────────────────────
const scoreVoiceAnswer = async (questionText, transcript) => {
  const prompt = `
You are an AI interview evaluator.

Question:
${questionText}

Candidate Answer (transcribed from audio):
${transcript || "(no answer provided)"}

Evaluate and return ONLY a number between 1 and 100.

Rules:
- 90–100: Excellent — comprehensive, accurate, well-structured
- 70–89:  Good — mostly correct with minor gaps
- 40–69:  Average — partially correct or vague
- 1–39:   Poor — incorrect or no meaningful answer

STRICT: Output only a single integer. No explanation.
`;
  const result = await model.generateContent(prompt);
  const text   = result.response.text().trim();
  return parseInt(text.match(/\d+/)?.[0]) || 0;
};

// ── Score an MCQ answer (binary) ───────────────────────────────────────────
const scoreMCQAnswer = (selectedOption, correctAnswer) => {
  if (!correctAnswer || !selectedOption) return 0;
  // selectedOption arrives as "A", "B", "C", or "D"
  // correctAnswer stored as "A", "B", "C", or "D"
  return selectedOption.trim().toUpperCase() === correctAnswer.trim().toUpperCase() ? 100 : 0;
};

// ── Main controller ────────────────────────────────────────────────────────
export const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;                  // sessionId
    const { question, selectedOption } = req.body;
    // selectedOption is sent for aptitude MCQs ("A" | "B" | "C" | "D")
    // audio file is attached for voice rounds

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

    // Fetch the full question document so we have correctAnswer + section
    const questionDoc = await Question.findById(currentQuestionId).lean();
    const section     = questionDoc?.section || session.section || "technical1";
    const isAptitude  = section === "aptitude";

    const file = req.file;

    // ── Transcribe (voice rounds only) ──
    let transcript = "";
    if (!isAptitude && file) {
      const audioBuffer = fs.readFileSync(file.path);
      const result = await model.generateContent([
        { inlineData: { mimeType: file.mimetype, data: audioBuffer.toString("base64") } },
        { text: "Transcribe this audio clearly and accurately." },
      ]);
      transcript = result.response.text();
    }

    // ── Score ──
    let score = 0;
    if (isAptitude) {
      // MCQ: binary scoring, no AI call needed
      score = scoreMCQAnswer(selectedOption, questionDoc?.correctAnswer);
    } else {
      score = await scoreVoiceAnswer(question, transcript);
    }

    // ── Persist answer ──
    await Answer.create({
      sessionId:  session._id,
      questionId: currentQuestionId,
      userId:     req.user.id,
      transcript: isAptitude ? `Selected: ${selectedOption || "none"}` : transcript,
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
      return res.status(200).json({
        success: true,
        data: { completed: true, score },
      });
    }

    await session.save();

    // ── Generate next question ──
    const QUESTION_PLAN = ["aptitude","technical1","technical2","coding","hr"];
    const nextSection   = session.section || QUESTION_PLAN[session.currentIndex % QUESTION_PLAN.length];

    // Resume text for technical2
    let resumeText = null;
    if (nextSection === "technical2" && session.driveId) {
      const drive = await Drive.findById(session.driveId).select("resumeText").lean();
      resumeText  = drive?.resumeText || null;
    }

    const previousQuestions = await Question.find({
      _id: { $in: session.questionIds },
    }).select("text").lean();

    const aiData = await generateQuestion({
      domain:   session.domain,
      level:    session.level,
      section:  nextSection,
      previousQuestions: previousQuestions.map((q) => q.text),
      resumeText,
    });

    const newQuestion = await Question.create({
      domain:           session.domain,
      level:            session.level,
      section:          nextSection,
      text:             aiData.text,
      options:          aiData.options       || [],
      correctAnswer:    aiData.correctAnswer || null,
      tags:             aiData.tags,
      expectedKeywords: aiData.expectedKeywords,
      rubric:           aiData.rubric,
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
        question:       newQuestion,  // includes options + correctAnswer for MCQ
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