import Session from "../models/session.model.js";
import Question from "../models/question.model.js";

export const startSession = async (req, res) => {
  try {
    const { domain, level } = req.body;

    if (!domain || !level) {
      return res.status(400).json({
        success: false,
        message: "domain and level are required",
      });
    }

    const aptitude = await Question.find({
      domain,
      level,
      section: "aptitude",
    }).limit(2);

    const technical1 = await Question.find({
      domain,
      level,
      section: "technical1",
    }).limit(3);

    const hr = await Question.find({
      domain,
      level,
      section: "hr",
    }).limit(1);

    const selectedQuestions = [...aptitude, ...technical1, ...hr];

    if (selectedQuestions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found for this domain and level",
      });
    }

    const session = await Session.create({
      userId: req.user.id,
      domain,
      level,
      questionIds: selectedQuestions.map((q) => q._id),
      currentIndex: 0,
      status: "in_progress",
    });

    return res.status(201).json({
      success: true,
      message: "Session started successfully",
      data: {
        sessionId: session._id,
        totalQuestions: selectedQuestions.length,
        currentIndex: 0,
        question: selectedQuestions[0],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to start session",
      error: error.message,
    });
  }
};