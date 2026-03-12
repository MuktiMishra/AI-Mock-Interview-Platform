import Session from "../models/session.model.js";
import Answer from "../models/answer.model.js";

export const getSessionAnswers = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (String(session.userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized for this session",
      });
    }

    const answers = await Answer.find({ sessionId: session._id })
      .populate("questionId", "text section domain level")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: answers.length,
      data: answers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch session answers",
      error: error.message,
    });
  }
};