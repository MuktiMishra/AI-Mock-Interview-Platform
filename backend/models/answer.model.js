import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true, index: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    audio: {
      fileName: String,
      mimeType: String,
      sizeBytes: Number,
      durationSec: Number,
      path: String
    },

    transcript: { type: String, default: "" },
    metrics: {
      fillerCount: { type: Number, default: 0 },
      wpm: { type: Number, default: 0 }
    },
    score: { type: Number, default: 0 },
    feedback: { type: String, default: "" }
  },
  { timestamps: true }
);

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;