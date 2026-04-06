import mongoose from "mongoose";

const roundSchema = new mongoose.Schema({
  section:     { type: String, enum: ["aptitude", "technical1", "technical2", "hr"], required: true },
  label:       { type: String, required: true },
  sessionId:   { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
  status:      { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
  avgScore:    { type: Number, default: null },
  completedAt: { type: Date,   default: null },
});

const driveSchema = new mongoose.Schema(
  {
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    domain:  { type: String, required: true, index: true },
    level:   { type: String, enum: ["fresher", "intermediate", "advanced"], required: true },
    rounds:  [roundSchema],
    status:  { type: String, enum: ["in_progress", "completed"], default: "in_progress" },

    // Resume for Technical II — extracted plain text stored after PDF upload
    resumeText:       { type: String, default: null },
    resumeFileName:   { type: String, default: null },
    resumeUploadedAt: { type: Date,   default: null },

    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Drive = mongoose.model("Drive", driveSchema);
export default Drive;