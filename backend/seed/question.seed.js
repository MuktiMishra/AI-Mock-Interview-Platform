import dotenv from "dotenv";
import mongoose from "mongoose";
import Question from "../models/question.model.js";

dotenv.config();

const questions = [
  {
    domain: "web-dev",
    level: "fresher",
    section: "aptitude",
    text: "If a train travels 60 km in 1 hour, how far will it travel in 3 hours?",
    tags: ["logic", "math"],
    expectedKeywords: ["180 km"],
    rubric: {
      points: 10,
      notes: "Checks basic arithmetic reasoning"
    }
  },
  {
    domain: "web-dev",
    level: "fresher",
    section: "aptitude",
    text: "What comes next in the series: 2, 4, 8, 16, ?",
    tags: ["series"],
    expectedKeywords: ["32"],
    rubric: {
      points: 10,
      notes: "Checks pattern recognition"
    }
  },
  {
    domain: "web-dev",
    level: "fresher",
    section: "technical1",
    text: "What is the difference between var, let, and const in JavaScript?",
    tags: ["javascript", "basics"],
    expectedKeywords: ["scope", "redeclare", "reassign", "block scope"],
    rubric: {
      points: 10,
      notes: "Candidate should explain scope and mutability"
    }
  },
  {
    domain: "web-dev",
    level: "fresher",
    section: "technical1",
    text: "What is the Virtual DOM in React?",
    tags: ["react"],
    expectedKeywords: ["virtual dom", "diffing", "performance"],
    rubric: {
      points: 10,
      notes: "Basic React concept"
    }
  },
  {
    domain: "web-dev",
    level: "fresher",
    section: "technical2",
    text: "Explain event bubbling in JavaScript.",
    tags: ["javascript", "dom"],
    expectedKeywords: ["propagation", "child to parent", "event bubbling"],
    rubric: {
      points: 10,
      notes: "DOM events concept"
    }
  },
  {
    domain: "web-dev",
    level: "fresher",
    section: "coding",
    text: "Write a function to reverse a string in JavaScript.",
    tags: ["javascript", "coding"],
    expectedKeywords: ["split", "reverse", "join", "loop"],
    rubric: {
      points: 10,
      notes: "Simple coding logic"
    }
  },
  {
    domain: "web-dev",
    level: "fresher",
    section: "hr",
    text: "Tell me about yourself.",
    tags: ["hr"],
    expectedKeywords: ["background", "skills", "goals"],
    rubric: {
      points: 10,
      notes: "Communication and self-introduction"
    }
  },
  {
    domain: "web-dev",
    level: "fresher",
    section: "hr",
    text: "Why do you want to become a web developer?",
    tags: ["hr", "motivation"],
    expectedKeywords: ["interest", "career", "development"],
    rubric: {
      points: 10,
      notes: "Motivation and clarity"
    }
  }
];

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Question.deleteMany({});
    console.log("Old questions removed");

    await Question.insertMany(questions);
    console.log("Questions inserted successfully");

    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedQuestions();