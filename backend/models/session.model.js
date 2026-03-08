const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    domain: { type: String, required: true, index: true },
    level: { type: String, enum: ["fresher", "intermediate", "advanced"], required: true, index: true },

    // question plan for this session (MVP: aptitude+technical+hr mixed)
    questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true }],

    currentIndex: { type: Number, default: 0 },
    status: { type: String, enum: ["in_progress", "completed"], default: "in_progress" },

    // for later: dynamic cross question rules
    crossQuestionPlan: {
      enabled: { type: Boolean, default: false },
      targetCount: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);