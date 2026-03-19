import Session from "../models/session.model.js";
import Question from "../models/question.model.js";
import Answer from "../models/answer.model.js";

import fs from "fs";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import OpenAI from "openai";
import dotenv from 'dotenv'
import model from "../utils/aiClient.js"

dotenv.config(); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const elevenlabs = new ElevenLabsClient();
export const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const {question} = req.body; 
    console.log(id)

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
      try {
        const response = await elevenlabs.speechToText.convert({
        file,
        modelId: "scribe_v2", // Model to use
        tagAudioEvents: true, // Tag audio events like laughter, applause, etc.
        languageCode: "eng", // Language of the audio file. If set to null, the model will detect the language automatically.
        diarize: true, // Whether to annotate who is speaking
      });

        transcript = response.text;
        // console.log(response)
      } catch (err) {
        console.log("Transcription error:", err.message);
      }
    }

      const prompt = `You are an AI employed to evaluate a candidate's interview answer.

    This is the interview question: ${question}
    This is the candidate's answer (transcript): ${transcript}

    Now I want you to evaluate the quality of the answer and return a score between 1 and 100.

    You must ONLY return a single number between 1 and 100. Do not return anything else, no explanation, no text, no symbols — just the number.

    Before you answer, understand the evaluation criteria:
    - 90–100: Excellent answer — very clear, well-structured, highly relevant, and demonstrates strong understanding.
    - 70–89: Good answer — mostly clear and relevant but may lack depth or minor clarity issues.
    - 40–69: Average answer — somewhat relevant but lacks structure, clarity, or completeness.
    - 1–39: Poor answer — unclear, irrelevant, incorrect, or very incomplete.

    It is very important that your response is strictly a single number between 1 and 100. You can now provide the score.`;

    const result = model.generateContent(prompt); 
    const response = (await result).response.text(); 
    console.log(question, response)

    await Answer.create({
      sessionId: session._id,
      questionId: currentQuestionId,
      userId: "69b331f2a1a48f5fa629022f",
      transcript,
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

    const nextQuestion = await Question.findById(
      session.questionIds[session.currentIndex]
    );

    return res.status(200).json({
      success: true,
      message: "Answer submitted",
      data: {
        completed: false,
        currentIndex: session.currentIndex,
        totalQuestions: session.questionIds.length,
        question: nextQuestion,
      },
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Failed to submit answer",
      error: error.message,
    });
  }
};