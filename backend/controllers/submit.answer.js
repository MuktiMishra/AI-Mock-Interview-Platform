import Session from "../models/session.model.js";
import Question from "../models/question.model.js";
import Answer from "../models/answer.model.js";

export const submitAnswer = async (req, res) => {
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
      return res.status(400).json({
        success: false,
        message: "Session already completed",
      });
    }

    const currentQuestionId = session.questionIds[session.currentIndex];

    if (!currentQuestionId) {
      session.status = "completed";
      session.completedAt = new Date();
      await session.save();

      return res.status(200).json({
        success: true,
        message: "Interview completed",
        data: { completed: true },
      });
    }

    const file = req.file;

    await Answer.create({
      sessionId: session._id,
      questionId: currentQuestionId,
      userId: "69b331f2a1a48f5fa629022f",
      audio: file
        ? {
            fileName: file.filename,
            mimeType: file.mimetype,
            sizeBytes: file.size,
            durationSec: 0,
            path: file.path,
          }
        : {
            fileName: "",
            mimeType: "",
            sizeBytes: 0,
            durationSec: 0,
            path: "",
          },
    });

    session.currentIndex += 1;

    if (session.currentIndex >= session.questionIds.length) {
      session.status = "completed";
      session.completedAt = new Date();
      await session.save();

      return res.status(200).json({
        success: true,
        message: "Interview completed",
        data: { completed: true },
      });
    }

    await session.save();

    const nextQuestion = await Question.findById(
      session.questionIds[session.currentIndex]
    );

    return res.status(200).json({
      success: true,
      message: "Answer submitted",
      data: {
        completed: false,
        currentIndex: session.currentIndex,
        totalQuestions: session.questionIds.length,
        question: nextQuestion,
      },
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Failed to submit answer",
      error: error.message,
    });
  }
};