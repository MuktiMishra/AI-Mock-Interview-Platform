import Session from "../models/session.model.js";
import Question from "../models/question.model.js";


export const getCurrentQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id)

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // if (String(session.userId) !== String(req.user.id)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Not authorized for this session",
    //   });
    // }

    if (session.status === "completed") {
      return res.status(200).json({
        success: true,
        message: "Session already completed",
        data: {
          completed: true,
        },
      });
    }

    const currentQuestionId = session.questionIds[session.currentIndex];

    if (!currentQuestionId) {
      session.status = "completed";
      session.completedAt = new Date();
      await session.save();

      return res.status(200).json({
        success: true,
        message: "Session completed",
        data: {
          completed: true,
        },
      });
    }

    const question = await Question.findById(currentQuestionId);

    return res.status(200).json({
      success: true,
      data: {
        sessionId: session._id,
        currentIndex: session.currentIndex,
        totalQuestions: session.questionIds.length,
        question,
      },
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Failed to get current question",
      error: error.message,
    });
  }
};