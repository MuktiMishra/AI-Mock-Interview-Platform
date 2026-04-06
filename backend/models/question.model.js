import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    domain:  { type: String, required: true, index: true },
    level:   { type: String, enum: ["fresher", "intermediate", "advanced"], required: true, index: true },
    section: { type: String, enum: ["aptitude", "technical1", "technical2", "coding", "hr"], required: true, index: true },

    text: { type: String, required: true },

    // ── MCQ fields (aptitude only) ──
    options:       [{ type: String }],   // ["A. ...", "B. ...", "C. ...", "D. ..."]
    correctAnswer: { type: String, default: null }, // "A", "B", "C", or "D"

    // ── Scoring metadata ──
    tags:             [{ type: String }],
    expectedKeywords: [{ type: String }],
    rubric: {
      points: { type: Number, default: 10 },
      notes:  { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;