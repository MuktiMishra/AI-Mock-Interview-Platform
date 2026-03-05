const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    domain: { type: String, required: true, index: true }, // e.g. "web-dev"
    level: { type: String, enum: ["fresher", "intermediate", "advanced"], required: true, index: true },
    section: { type: String, enum: ["aptitude", "technical1", "technical2", "coding", "hr"], required: true, index: true },

    text: { type: String, required: true },

    // for later AI scoring/cross-questions
    tags: [{ type: String }],
    expectedKeywords: [{ type: String }],
    rubric: {
      points: { type: Number, default: 10 }, // total points for this question
      notes: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);