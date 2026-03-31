import Session from "../models/session.model.js";
import Question from "../models/question.model.js";
import Answer from "../models/answer.model.js";
import fs from "fs";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import dotenv from "dotenv";
import model from "../utils/geminiClient.js";
import { generateQuestion } from "./get.current.question.js";
import axios from "axios";
dotenv.config();

console.log(process.env.ELEVENLABS_API_KEY);
const elevenlabs = new ElevenLabsClient();
export const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { question } = req.body;
    console.log(id);

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // if (String(session.userId) !== String(req.user.id)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Not authorized for this session",
    //   });
    // }

    if (session.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Session already completed",
      });
    }

    const currentQuestionId = session.questionIds[session.currentIndex];

    if (!currentQuestionId) {
      session.status = "completed";
      session.completedAt = new Date();
      await session.save();

      return res.status(200).json({
        success: true,
        message: "Interview completed",
        data: { completed: true },
      });
    }

    const file = req.file;

    let transcript = "";

    if (file) {
      const audioBuffer = fs.readFileSync(file.path);

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: file.mimetype,
            data: audioBuffer.toString("base64"),
          },
        },
        {
          text: "Transcribe this audio clearly.",
        },
      ]);

      transcript = result.response.text();
    }

    const prompt = `
You are an AI interview evaluator.

Question:
${question}

Candidate Answer:
${transcript}

Evaluate and return ONLY a number between 1 and 100.

Rules:
- 90–100: Excellent
- 70–89: Good
- 40–69: Average
- 1–39: Poor

STRICT: Only output a number.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Extract number safely
    const score = parseInt(text.match(/\d+/)?.[0]) || 0;

    await Answer.create({
      sessionId: session._id,
      questionId: currentQuestionId,
      userId: req.user.id,
      transcript,
      score,
      audio: file
        ? {
            fileName: file.filename,
            mimeType: file.mimetype,
            sizeBytes: file.size,
            durationSec: 0,
            path: file.path,
          }
        : {
            fileName: "",
            mimeType: "",
            sizeBytes: 0,
            durationSec: 0,
            path: "",
          },
    });

    session.currentIndex += 1;

    if (session.currentIndex >= session.questionIds.length) {
      session.status = "completed";
      session.completedAt = new Date();
      await session.save();

      return res.status(200).json({
        success: true,
        message: "Interview completed",
        data: { completed: true },
      });
    }

    await session.save();

    const sections = ["aptitude", "technical1", "technical2", "coding", "hr"];
    const section = sections[session.currentIndex % sections.length];

    const aiData = await generateQuestion({
      domain: session.domain,
      level: session.level,
      section,
    });

    // Save new question
    const newQuestion = await Question.create({
      domain: session.domain,
      level: session.level,
      section,
      text: aiData.text,
      tags: aiData.tags,
      expectedKeywords: aiData.expectedKeywords,
      rubric: aiData.rubric,
    });

    session.questionIds.push(newQuestion._id);
    await session.save();

    return res.status(200).json({
      success: true,
      message: "Answer submitted",
      data: {
        completed: false,
        currentIndex: session.currentIndex,
        totalQuestions: 10,
        question: newQuestion,
      },
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit answer",
      error: error.message,
    });
  }
};
