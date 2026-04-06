import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    domain:  { type: String, required: true, index: true },
    level:   { type: String, enum: ["fresher", "intermediate", "advanced"], required: true, index: true },

    // Set when this session belongs to a Drive round — determines question section
    // and enables resume lookup for technical2.
    // null for standalone (non-drive) sessions.
    section: {
      type:    String,
      enum:    ["aptitude", "technical1", "technical2", "coding", "hr", null],
      default: null,
      index:   true,
    },
    driveId: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     "Drive",
      default: null,
      index:   true,
    },

    questionIds:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true }],
    currentIndex: { type: Number, default: 0 },
    status:       { type: String, enum: ["in_progress", "completed"], default: "in_progress" },
    startedAt:    { type: Date,   default: Date.now },
    completedAt:  { type: Date,   default: null },

    crossQuestionPlan: {
      enabled:     { type: Boolean, default: false },
      targetCount: { type: Number,  default: 0 },
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;