import Session from "../models/session.model.js";
import Question from "../models/question.model.js";
import model from "../utils/geminiClient.js"
import { QUESTION_PLAN } from "../utils/questionPlan.js";

export const generateQuestion = async ({
  domain,
  level,
  section,
  previousQuestions = [],
}) => {
  const prompt = `
You are an AI mock interviewer.

Generate ONE unique interview question.

Context:
- Domain: ${domain}
- Level: ${level}
- Section: ${section}

Avoid repeating these questions:
${previousQuestions.join("\n")}

Return ONLY JSON:
{
  "text": "question here",
  "tags": ["tag1", "tag2"],
  "expectedKeywords": ["keyword1", "keyword2"],
  "rubric": {
    "points": 10,
    "notes": "what a strong answer should include"
  }
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const cleaned = text.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned);
};

export const getCurrentQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("came here")

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (session.status === "completed") {
      return res.status(200).json({
        success: true,
        message: "Session already completed",
        data: { completed: true },
      });
    }

    // ✅ Limit questions (important)
    const TOTAL_QUESTIONS = 10;

    if (session.currentIndex >= TOTAL_QUESTIONS) {
      session.status = "completed";
      session.completedAt = new Date();
      await session.save();

      return res.status(200).json({
        success: true,
        message: "Session completed",
        data: { completed: true },
      });
    }

    const section = QUESTION_PLAN[session.currentIndex];

    // 🧠 (Optional but powerful) Avoid repetition
    const previousQuestions = await Question.find({
      _id: { $in: session.questionIds },
    }).select("text");

    const aiData = await generateQuestion({
      domain: session.domain,
      level: session.level,
      section,
      previousQuestions: previousQuestions.map((q) => q.text),
    });

    // ✅ Save generated question (for tracking, analytics, scoring later)
    const question = await Question.create({
      domain: session.domain,
      level: session.level,
      section,
      text: aiData.text,
      tags: aiData.tags,
      expectedKeywords: aiData.expectedKeywords,
      rubric: aiData.rubric,
    });

    // ✅ Attach to session
    session.questionIds.push(question._id);
    await session.save();

    return res.status(200).json({
      success: true,
      data: {
        sessionId: session._id,
        currentIndex: session.currentIndex,
        totalQuestions: TOTAL_QUESTIONS,
        question,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get current question",
      error: error.message,
    });
  }
};