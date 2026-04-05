import Drive from "../models/drive.model.js";
import Session from "../models/session.model.js";
import Answer from "../models/answer.model.js";
import { DRIVE_ROUNDS } from "../utils/drivePlan.js";

// ── POST /drive/start ──────────────────────────────────────────────────────────
export const startDrive = async (req, res) => {
  try {
    const { domain, level } = req.body;

    if (!domain || !level) {
      return res.status(400).json({
        success: false,
        message: "domain and level are required",
      });
    }

    // Create one Session per round upfront — all start empty (questions generated on demand)
    const rounds = [];

    for (const round of DRIVE_ROUNDS) {
      const session = await Session.create({
        userId: req.user.id,
        domain,
        level,
        section: round.section,
        questionIds: [],
        currentIndex: 0,
        status: "in_progress",
      });

      rounds.push({
        section: round.section,
        label: round.label,
        sessionId: session._id,
        status: "pending",
        avgScore: null,
      });
    }

    const drive = await Drive.create({
      userId: req.user.id,
      domain,
      level,
      rounds,
      status: "in_progress",
    });

    return res.status(201).json({
      success: true,
      message: "Drive started successfully",
      data: {
        driveId: drive._id,
        domain,
        level,
        totalRounds: rounds.length,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to start drive",
      error: error.message,
    });
  }
};

// ── GET /drive/:id ─────────────────────────────────────────────────────────────
export const getDrive = async (req, res) => {
  try {
    const { id } = req.params;

    const drive = await Drive.findById(id).lean();

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: "Drive not found",
      });
    }

    if (String(drive.userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized for this drive",
      });
    }

    // For each round, recompute avgScore live from answers (source of truth)
    const enrichedRounds = await Promise.all(
      drive.rounds.map(async (round) => {
        if (round.status !== "completed") {
          // Also check if the underlying session was completed (e.g. user finished
          // the interview but drive round status wasn't updated yet — safety net)
          const session = await Session.findById(round.sessionId)
            .select("status currentIndex")
            .lean();

          if (session?.status === "completed" && round.status !== "completed") {
            // Recompute and sync — handled below
            round.status = "completed";
          }
        }

        if (round.status === "completed") {
          const answers = await Answer.find({ sessionId: round.sessionId })
            .select("score")
            .lean();
          const avgScore = answers.length
            ? Math.round(
                answers.reduce((sum, a) => sum + a.score, 0) / answers.length,
              )
            : 0;
          return { ...round, avgScore };
        }

        return { ...round, avgScore: null };
      }),
    );

    // Recheck overall drive completion
    const allCompleted = enrichedRounds.every((r) => r.status === "completed");

    // Compute overall score across all completed rounds
    const completedRounds = enrichedRounds.filter(
      (r) => r.status === "completed",
    );
    const overallAvg = completedRounds.length
      ? Math.round(
          completedRounds.reduce((sum, r) => sum + (r.avgScore || 0), 0) /
            completedRounds.length,
        )
      : null;

    const completedCount = completedRounds.length;

    return res.status(200).json({
      success: true,
      data: {
        driveId: drive._id,
        domain: drive.domain,
        level: drive.level,
        status: allCompleted ? "completed" : "in_progress",
        rounds: enrichedRounds,
        completedCount,
        totalRounds: enrichedRounds.length,
        overallAvg,
        startedAt: drive.createdAt,
        completedAt: drive.completedAt,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch drive",
      error: error.message,
    });
  }
};

// ── POST /drive/:id/complete-round ────────────────────────────────────────────
// Called by the frontend when a session (round) finishes, to mark that round
// as completed on the Drive document and check if the whole drive is done.
export const completeRound = async (req, res) => {
  try {
    const { id } = req.params; // driveId
    const { sessionId } = req.body; // which session just finished

    const drive = await Drive.findById(id);

    if (!drive) {
      return res
        .status(404)
        .json({ success: false, message: "Drive not found" });
    }

    if (String(drive.userId) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Find the matching round and mark it completed
    const round = drive.rounds.find(
      (r) => String(r.sessionId) === String(sessionId),
    );

    if (!round) {
      return res
        .status(404)
        .json({ success: false, message: "Round not found in drive" });
    }

    // Compute avgScore for this round from answers
    const answers = await Answer.find({ sessionId }).select("score").lean();
    const avgScore = answers.length
      ? Math.round(
          answers.reduce((sum, a) => sum + a.score, 0) / answers.length,
        )
      : 0;

    round.status = "completed";
    round.avgScore = avgScore;
    round.completedAt = new Date();

    // Check if all rounds are now done
    const allDone = drive.rounds.every((r) => r.status === "completed");
    if (allDone) {
      drive.status = "completed";
      drive.completedAt = new Date();
    }

    await drive.save();

    return res.status(200).json({
      success: true,
      data: {
        driveCompleted: allDone,
        roundAvgScore: avgScore,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to complete round",
      error: error.message,
    });
  }
};

// ── PATCH /drive/:id/round/:sessionId/start ───────────────────────────────────
// Marks a round as in_progress when the user clicks into it from the hub.
export const startRound = async (req, res) => {
  try {
    const { id, sessionId } = req.params;

    const drive = await Drive.findById(id);

    if (!drive) {
      return res
        .status(404)
        .json({ success: false, message: "Drive not found" });
    }

    if (String(drive.userId) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const round = drive.rounds.find(
      (r) => String(r.sessionId) === String(sessionId),
    );

    if (!round) {
      return res
        .status(404)
        .json({ success: false, message: "Round not found" });
    }

    if (round.status === "pending") {
      round.status = "in_progress";
      await drive.save();
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to start round",
      error: error.message,
    });
  }
};
