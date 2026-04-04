import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Session from "../models/session.model.js";

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(name, email, password)

        if (!name || !email || !password) {

            return res.status(400).json({ message: "All fields are required" });
        }

        const isExist = await User.findOne({ email });

        if (isExist) {
          console.log("came here")
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
        
        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // true in production (HTTPS)
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        res.json({
          message: "Login successful",
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const getUserSessions = async (req, res) => {
  try {
    const userId = req.user.id;
 
    // Fetch last 20 completed sessions for this user
    const sessions = await Session.find({ userId, status: "completed" })
      .sort({ completedAt: -1 })
      .limit(20)
      .lean();
 
    if (sessions.length === 0) {
      return res.status(200).json({
        success: true,
        data: { sessions: [], stats: emptyStats() },
      });
    }
 
    const sessionIds = sessions.map((s) => s._id);
 
    // Fetch all answers for these sessions in one query
    const answers = await Answer.find({ sessionId: { $in: sessionIds } })
      .select("sessionId score createdAt")
      .lean();
 
    // Group answers by sessionId
    const answersBySession = {};
    answers.forEach((a) => {
      const key = String(a.sessionId);
      if (!answersBySession[key]) answersBySession[key] = [];
      answersBySession[key].push(a.score);
    });
 
    // Enrich each session with its avg score
    const enriched = sessions.map((s) => {
      const scores = answersBySession[String(s._id)] || [];
      const avg = scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
      return { ...s, avgScore: avg, totalAnswers: scores.length };
    });
 
    // ── Compute stats ──
 
    // Total sessions
    const totalSessions = enriched.length;
 
    // Avg score across all sessions
    const overallAvg = Math.round(
      enriched.reduce((sum, s) => sum + s.avgScore, 0) / totalSessions
    );
 
    // Best domain (most sessions)
    const domainCount = {};
    enriched.forEach((s) => {
      domainCount[s.domain] = (domainCount[s.domain] || 0) + 1;
    });
    const bestDomain = Object.entries(domainCount).sort((a, b) => b[1] - a[1])[0];
 
    // Score by domain (avg score per domain)
    const domainScores = {};
    const domainTotals = {};
    enriched.forEach((s) => {
      if (!domainScores[s.domain]) { domainScores[s.domain] = 0; domainTotals[s.domain] = 0; }
      domainScores[s.domain] += s.avgScore;
      domainTotals[s.domain] += 1;
    });
    const scoreByDomain = Object.entries(domainScores).map(([domain, total]) => ({
      domain,
      avg: Math.round(total / domainTotals[domain]),
    })).sort((a, b) => b.avg - a.avg);
 
    // Streak — count consecutive days with at least one session ending from today backwards
    const streak = computeStreak(enriched);
 
    // Sessions this week (for delta)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const sessionsThisWeek = enriched.filter(
      (s) => new Date(s.completedAt) >= oneWeekAgo
    ).length;
 
    return res.status(200).json({
      success: true,
      data: {
        sessions: enriched.slice(0, 5), // last 5 for recent sessions panel
        stats: {
          totalSessions,
          overallAvg,
          bestDomain: bestDomain ? { name: bestDomain[0], count: bestDomain[1] } : null,
          streak,
          sessionsThisWeek,
          scoreByDomain,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
      error: error.message,
    });
  }
};
 
function computeStreak(sessions) {
  if (!sessions.length) return 0;
 
  // Get unique days that had a completed session (YYYY-MM-DD strings)
  const days = new Set(
    sessions.map((s) => new Date(s.completedAt).toISOString().slice(0, 10))
  );
 
  let streak = 0;
  const today = new Date();
 
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak++;
    } else {
      break; // streak broken
    }
  }
 
  return streak;
}
 
function emptyStats() {
  return {
    totalSessions: 0,
    overallAvg: 0,
    bestDomain: null,
    streak: 0,
    sessionsThisWeek: 0,
    scoreByDomain: [],
  };
}
 