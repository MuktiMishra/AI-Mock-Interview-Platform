import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Session from "../models/session.model.js";
import Answer from "../models/answer.model.js";
import Drive from "../models/drive.model.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isExist = await User.findOne({ email });

    if (isExist) {
      console.log("came here");
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // res.status(201).json({
    //     message: "User created successfully",
    //     user: {
    //         id: user._id,
    //         name: user.name,
    //         email: user.email
    //     }
    // });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
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

    const sessions = await Session.find({ userId })
      .sort({ completedAt: -1, createdAt: -1 })
      .limit(20)
      .lean();

    if (sessions.length === 0) {
      return res.status(200).json({
        success: true,
        data: { sessions: [], stats: emptyStats() },
      });
    }

    const sessionIds = sessions.map((s) => s._id);

    const answers = await Answer.find({ sessionId: { $in: sessionIds } })
      .select("sessionId score createdAt")
      .lean();

    const answersBySession = {};
    answers.forEach((a) => {
      const key = String(a.sessionId);
      if (!answersBySession[key]) answersBySession[key] = [];
      answersBySession[key].push(a.score);
    });

    // ── Fetch all drives linked to these sessions ──────────────────────────
    const driveIds = [
      ...new Set(
        sessions.filter((s) => s.driveId).map((s) => String(s.driveId)),
      ),
    ];

    const drives = driveIds.length
      ? await Drive.find({ _id: { $in: driveIds } })
          .select("_id status completedAt avgScore")
          .lean()
      : [];

    const driveMap = {};
    drives.forEach((d) => {
      driveMap[String(d._id)] = d;
    });
    // ─────────────────────────────────────────────────────────────────────

    const enriched = sessions.map((s) => {
      const scores = answersBySession[String(s._id)] || [];
      const avg = scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : null;

      // ── If this session belongs to a drive, use the drive's status ──
      const drive = s.driveId ? driveMap[String(s.driveId)] : null;
      const effectiveStatus = drive ? drive.status : s.status;
      const effectiveCompletedAt = drive ? drive.completedAt : s.completedAt;

      return {
        ...s,
        avgScore: avg,
        totalAnswers: scores.length,
        startedAt: s.startedAt || s.createdAt,
        // Override status/completedAt for drive sessions
        status: effectiveStatus,
        completedAt: effectiveCompletedAt,
      };
    });

    // ── De-duplicate drive sessions — keep only ONE row per driveId ────────
    // (since a drive creates 4 sessions, we'd show 4 rows otherwise)
    const seenDrives = new Set();
    const deduplicated = enriched.filter((s) => {
      if (!s.driveId) return true; // standalone session, always keep
      const key = String(s.driveId);
      if (seenDrives.has(key)) return false;
      seenDrives.add(key);
      return true;
    });

    // Stats should only count completed items
    const completedSessions = deduplicated.filter(
      (s) => s.status === "completed",
    );
    const totalSessions = completedSessions.length;
    const overallAvg = completedSessions.length
      ? Math.round(
          completedSessions.reduce((sum, s) => sum + (s.avgScore || 0), 0) /
            completedSessions.length,
        )
      : 0;

    const domainCount = {};
    deduplicated.forEach((s) => {
      domainCount[s.domain] = (domainCount[s.domain] || 0) + 1;
    });
    const bestDomain = Object.entries(domainCount).sort(
      (a, b) => b[1] - a[1],
    )[0];

    const domainScores = {};
    const domainTotals = {};
    deduplicated.forEach((s) => {
      if (s.avgScore == null) return;
      if (!domainScores[s.domain]) {
        domainScores[s.domain] = 0;
        domainTotals[s.domain] = 0;
      }
      domainScores[s.domain] += s.avgScore;
      domainTotals[s.domain] += 1;
    });
    const scoreByDomain = Object.entries(domainScores)
      .map(([domain, total]) => ({
        domain,
        avg: Math.round(total / domainTotals[domain]),
      }))
      .sort((a, b) => b.avg - a.avg);

    const streak = computeStreak(deduplicated);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const sessionsThisWeek = deduplicated.filter(
      (s) => s.completedAt && new Date(s.completedAt) >= oneWeekAgo,
    ).length;

    return res.status(200).json({
      success: true,
      data: {
        sessions: deduplicated.slice(0, 5),
        stats: {
          totalSessions,
          overallAvg,
          bestDomain: bestDomain
            ? { name: bestDomain[0], count: bestDomain[1] }
            : null,
          streak,
          sessionsThisWeek,
          scoreByDomain,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
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
    sessions.map((s) => new Date(s.completedAt).toISOString().slice(0, 10)),
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
