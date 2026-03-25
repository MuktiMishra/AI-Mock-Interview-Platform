import Session from "../models/session.model.js";
import Question from "../models/question.model.js";
import Answer from "../models/answer.model.js";
import fs from "fs";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import dotenv from "dotenv";
import model from "../utils/aiClient.js";
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

    console.log(transcript)

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

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "stepfun/step-3.5-flash:free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          stream: true
        }),
      },
    );

    const reader = response.body.getReader();
    console.log(reader)
    const decoder = new TextDecoder("utf-8");

    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      const lines = chunk.split("\n");

      for (let line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.replace("data: ", "").trim();

          if (data === "[DONE]") break;

          try {
            const json = JSON.parse(data);

            const content =
              json.choices?.[0]?.delta?.content ||
              json.choices?.[0]?.message?.content;

            if (content) {
              fullText += content;
            }
          } catch (err) {
            // ignore partial chunks
          }
        }
      }
    }


    const score = parseInt(fullText.match(/\d+/)?.[0]);
    console.log(req.user.id)

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

    const nextQuestion = await Question.findById(
      session.questionIds[session.currentIndex],
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
    console.log("error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit answer",
      error: error.message,
    });
  }
};
