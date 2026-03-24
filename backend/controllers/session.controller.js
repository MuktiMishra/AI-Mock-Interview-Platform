import Session from "../models/session.model.js";
import Question from "../models/question.model.js";
import Answer from "../models/answer.model.js";

export const startSession = async (req, res) => {
  console.log("came here")
  try {
    const { domain, level } = req.body;

    if (!domain || !level) {
      return res.status(400).json({
        success: false,
        message: "domain and level are required",
      });
    }

    console.log(domain, level)

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
      userId: "69b331f2a1a48f5fa629022f", // req.user.id for testing put 123
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
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Failed to start session",
      error: error.message,
    });
  }
};

export const getReport = async (req, res) => {
  try {
    const { id } = req.params;

    const answers = await Answer.find({ sessionId: id })
      .populate("questionId");

    return res.status(200).json({
      success: true,
      data: {
        answers,
      },
    });
  } catch (error) {
    console.log("error", error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};