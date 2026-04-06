import Session from "../models/session.model.js";
import Question from "../models/question.model.js";
import Drive    from "../models/drive.model.js";
import model    from "../utils/geminiClient.js";

// ── Question generator ─────────────────────────────────────────────────────

export const generateQuestion = async ({
  domain,
  level,
  section,
  previousQuestions = [],
  resumeText = null,       // only used for technical2
}) => {

  // ── APTITUDE → MCQ ──
  if (section === "aptitude") {
    const prompt = `
You are an AI aptitude test generator for campus placement interviews.

Generate ONE multiple-choice aptitude question.

Context:
- Domain: ${domain}
- Level: ${level}
- Topic areas: logical reasoning, quantitative aptitude, verbal ability, data interpretation

Avoid repeating these questions:
${previousQuestions.join("\n")}

Return ONLY valid JSON, no markdown, no extra text:
{
  "text": "question stem here",
  "options": ["A. option one", "B. option two", "C. option three", "D. option four"],
  "correctAnswer": "A",
  "tags": ["tag1", "tag2"],
  "rubric": {
    "points": 10,
    "notes": "why this answer is correct"
  }
}

Rules:
- options must be exactly 4, each prefixed with A. B. C. D.
- correctAnswer must be exactly one of: "A", "B", "C", "D"
- question should be solvable in under 40 seconds
- do NOT include the answer explanation in the question text
`;
    const result  = await model.generateContent(prompt);
    const text    = result.response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed  = JSON.parse(cleaned);

    return {
      text:          parsed.text,
      options:       parsed.options,
      correctAnswer: parsed.correctAnswer,
      tags:          parsed.tags          || [],
      expectedKeywords: [],
      rubric:        parsed.rubric        || { points: 10, notes: "" },
    };
  }

  // ── TECHNICAL II → Resume-aware open question ──
  if (section === "technical2" && resumeText) {
    const prompt = `
You are an AI technical interviewer conducting a resume-based interview.

The candidate's resume is provided below. Generate ONE technical interview question
that is DIRECTLY based on something specific in their resume — a technology they listed,
a project they built, a role they held, or a skill they claimed.

The question should probe depth of understanding, not just surface knowledge.

Candidate Resume:
---
${resumeText.slice(0, 4000)}
---

Context:
- Domain: ${domain}
- Level: ${level}

Avoid repeating these questions:
${previousQuestions.join("\n")}

Return ONLY valid JSON, no markdown, no extra text:
{
  "text": "question here — must reference something specific from the resume",
  "tags": ["tag1", "tag2"],
  "expectedKeywords": ["keyword1", "keyword2"],
  "rubric": {
    "points": 10,
    "notes": "what a strong answer should cover"
  }
}
`;
    const result  = await model.generateContent(prompt);
    const text    = result.response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed  = JSON.parse(cleaned);

    return {
      text:             parsed.text,
      options:          [],
      correctAnswer:    null,
      tags:             parsed.tags             || [],
      expectedKeywords: parsed.expectedKeywords || [],
      rubric:           parsed.rubric           || { points: 10, notes: "" },
    };
  }

  // ── ALL OTHER SECTIONS (technical1, hr, coding) → standard open question ──
  const prompt = `
You are an AI mock interviewer.

Generate ONE unique interview question.

Context:
- Domain: ${domain}
- Level: ${level}
- Section: ${section}

Avoid repeating these questions:
${previousQuestions.join("\n")}

Return ONLY valid JSON, no markdown, no extra text:
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
  const result  = await model.generateContent(prompt);
  const text    = result.response.text();
  const cleaned = text.replace(/```json|```/g, "").trim();
  const parsed  = JSON.parse(cleaned);

  return {
    text:             parsed.text,
    options:          [],
    correctAnswer:    null,
    tags:             parsed.tags             || [],
    expectedKeywords: parsed.expectedKeywords || [],
    rubric:           parsed.rubric           || { points: 10, notes: "" },
  };
};

// ── getCurrentQuestion controller ──────────────────────────────────────────

export const getCurrentQuestion = async (req, res) => {
  try {
    const { id } = req.params;  // sessionId

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.status === "completed") {
      return res.status(200).json({ success: true, data: { completed: true } });
    }

    const TOTAL_QUESTIONS = 10;

    if (session.currentIndex >= TOTAL_QUESTIONS) {
      session.status      = "completed";
      session.completedAt = new Date();
      await session.save();
      return res.status(200).json({ success: true, data: { completed: true } });
    }

    // Determine section for this session
    // Sessions created by a Drive have all questions from one section (stored on session).
    // Standalone sessions use the mixed QUESTION_PLAN.
    const QUESTION_PLAN = ["aptitude","technical1","technical2","coding","hr"];
    const section = session.section || QUESTION_PLAN[session.currentIndex % QUESTION_PLAN.length];

    // Fetch resume text from Drive if this is a technical2 session
    let resumeText = null;
    if (section === "technical2" && session.driveId) {
      const drive = await Drive.findById(session.driveId).select("resumeText").lean();
      resumeText = drive?.resumeText || null;
    }

    // Avoid repeating questions already asked in this session
    const previousQuestions = await Question.find({
      _id: { $in: session.questionIds },
    }).select("text").lean();

    const aiData = await generateQuestion({
      domain:   session.domain,
      level:    session.level,
      section,
      previousQuestions: previousQuestions.map((q) => q.text),
      resumeText,
    });

    const question = await Question.create({
      domain:        session.domain,
      level:         session.level,
      section,
      text:          aiData.text,
      options:       aiData.options       || [],
      correctAnswer: aiData.correctAnswer || null,
      tags:          aiData.tags,
      expectedKeywords: aiData.expectedKeywords,
      rubric:        aiData.rubric,
    });

    session.questionIds.push(question._id);
    await session.save();

    return res.status(200).json({
      success: true,
      data: {
        sessionId:      session._id,
        currentIndex:   session.currentIndex,
        totalQuestions: TOTAL_QUESTIONS,
        section,
        question,  // includes options + correctAnswer for MCQ
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get current question",
      error: error.message,
    });
  }
};