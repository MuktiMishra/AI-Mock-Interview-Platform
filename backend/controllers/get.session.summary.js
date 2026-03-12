import Session from "../models/Session.js";
import Answer from "../models/Answer.js";

export const getSessionSummary = async (req, res) => {
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

    const answersCount = await Answer.countDocuments({ sessionId: session._id });

    return res.status(200).json({
      success: true,
      data: {
        sessionId: session._id,
        domain: session.domain,
        level: session.level,
        status: session.status,
        totalQuestions: session.questionIds.length,
        answersSubmitted: answersCount,
        currentIndex: session.currentIndex,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch session summary",
      error: error.message,
    });
  }
};