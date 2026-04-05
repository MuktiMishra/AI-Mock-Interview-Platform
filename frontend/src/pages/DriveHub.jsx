import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function capitalize(s = "") { return s.charAt(0).toUpperCase() + s.slice(1); }

// ── Section colours ──
const SECTION_STYLE = {
  aptitude:   { color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)",  glow: "rgba(167,139,250,0.15)" },
  technical1: { color: "#60a5fa", bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.2)",   glow: "rgba(96,165,250,0.15)"  },
  technical2: { color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)",   glow: "rgba(52,211,153,0.15)"  },
  hr:         { color: "#f472b6", bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.2)",  glow: "rgba(244,114,182,0.15)" },
};

const STATUS_BADGE = {
  pending:     { label: "Pending",     color: "rgba(255,255,255,0.3)",  bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)"  },
  in_progress: { label: "In Progress", color: "rgba(251,191,36,0.85)",  bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)"  },
  completed:   { label: "Completed",   color: "rgba(52,211,153,0.9)",   bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.25)"  },
};

// ── Icons ──
function Icon({ name, size = 16 }) {
  const s = { width: size, height: size, flexShrink: 0 };
  if (name === "aptitude") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (name === "technical1" || name === "technical2") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
  if (name === "hr") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
  if (name === "check") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (name === "play") return (
    <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
  );
  if (name === "arrow") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (name === "trophy") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9H3V4h3M18 9h3V4h-3M6 9a6 6 0 0 0 12 0M12 15v4M8 19h8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (name === "back") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return null;
}

function LivePulse() {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
      <span style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: "rgba(167,139,250,0.75)", animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
      <span style={{ position: "relative", width: 8, height: 8, borderRadius: "50%", background: "#7c3aed" }} />
    </span>
  );
}

function SkeletonBlock({ width = "100%", height = 14, radius = 6 }) {
  return <div style={{ width, height, borderRadius: radius, background: "rgba(255,255,255,0.06)", animation: "pulse 1.8s ease-in-out infinite" }} />;
}

function scoreColor(score) {
  if (score >= 80) return "rgba(52,211,153,0.9)";
  if (score >= 70) return "rgba(251,191,36,0.85)";
  return "rgba(248,113,113,0.85)";
}
function scoreLabel(score) {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 40) return "Average";
  return "Needs work";
}

// ── Round Card ──────────────────────────────────────────────────────────────
function RoundCard({ round, index, driveId, onStart }) {
  const [hovered, setHovered]   = useState(false);
  const style  = SECTION_STYLE[round.section] || SECTION_STYLE.aptitude;
  const badge  = STATUS_BADGE[round.status]   || STATUS_BADGE.pending;
  const isDone = round.status === "completed";
  const isPending = round.status === "pending";
  const isActive  = round.status === "in_progress";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", borderRadius: 20, overflow: "hidden",
        border: `1px solid ${hovered && !isPending ? style.border : "rgba(255,255,255,0.07)"}`,
        background: hovered && !isPending ? style.bg : "rgba(255,255,255,0.025)",
        transition: "all 0.25s ease",
        boxShadow: hovered && isDone ? `0 0 32px ${style.glow}` : "none",
        cursor: isPending ? "default" : "pointer",
      }}
    >
      {/* Completed shimmer line at top */}
      {isDone && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${style.color}, transparent)` }} />
      )}

      <div style={{ padding: "24px 26px" }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Round number bubble */}
            <div style={{
              width: 42, height: 42, borderRadius: 13, flexShrink: 0,
              background: isDone ? style.bg : "rgba(255,255,255,0.04)",
              border: `1px solid ${isDone ? style.border : "rgba(255,255,255,0.08)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: isDone ? style.color : "rgba(255,255,255,0.25)",
              transition: "all 0.25s",
            }}>
              {isDone
                ? <Icon name="check" size={16} />
                : <span style={{ fontSize: 15, fontWeight: 700, fontFamily: "monospace" }}>{index + 1}</span>
              }
            </div>

            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: isDone ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)", marginBottom: 4, transition: "color 0.25s" }}>
                {round.label}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>10 questions · 40s each</div>
            </div>
          </div>

          {/* Status badge */}
          <div style={{
            padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 700,
            letterSpacing: "0.06em", textTransform: "uppercase",
            background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`,
            transition: "all 0.25s",
          }}>
            {isActive && <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: badge.color, marginRight: 5, animation: "ping 1.5s infinite", verticalAlign: "middle" }} />}
            {badge.label}
          </div>
        </div>

        {/* Completed hover details */}
        {isDone && hovered && round.avgScore !== null && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 14px", borderRadius: 12, marginBottom: 16,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            animation: "fadeIn 0.2s ease",
          }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.25)", marginBottom: 4 }}>Avg Score</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace", color: scoreColor(round.avgScore) }}>
                {round.avgScore}%
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.25)", marginBottom: 4 }}>Performance</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: scoreColor(round.avgScore) }}>{scoreLabel(round.avgScore)}</div>
            </div>
          </div>
        )}

        {/* Section icon bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: isDone ? style.color : "rgba(255,255,255,0.15)", transition: "color 0.25s" }}>
            <Icon name={round.section} size={14} />
          </span>
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
            {isDone && (
              <div style={{ height: "100%", width: `${round.avgScore || 0}%`, background: `linear-gradient(90deg, ${style.color}80, ${style.color})`, borderRadius: 2, transition: "width 0.6s ease" }} />
            )}
          </div>
          {isDone && round.avgScore !== null && (
            <span style={{ fontSize: 11, fontFamily: "monospace", color: style.color, fontWeight: 700 }}>{round.avgScore}%</span>
          )}
        </div>

        {/* CTA */}
        {!isPending && (
          <div style={{ marginTop: 18 }}>
            <button
              onClick={() => onStart(round)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "11px", borderRadius: 12, border: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: 13, fontWeight: 700, transition: "all 0.2s",
                background: isDone ? "rgba(255,255,255,0.04)" : style.bg,
                color: isDone ? "rgba(255,255,255,0.4)" : style.color,
                borderWidth: 1, borderStyle: "solid",
                borderColor: isDone ? "rgba(255,255,255,0.08)" : style.border,
              }}
            >
              {isDone ? (
                <><Icon name="arrow" size={14} />View Report</>
              ) : (
                <><Icon name="play" size={14} />{isActive ? "Continue Round" : "Start Round"}</>
              )}
            </button>
          </div>
        )}

        {isPending && (
          <div style={{ marginTop: 18, padding: "10px", borderRadius: 12, textAlign: "center", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.18)" }}>Click to start this round</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main DriveHub ───────────────────────────────────────────────────────────
const DriveHub = () => {
  const { driveId } = useParams();
  const navigate    = useNavigate();

  const [drive, setDrive]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchDrive = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8000/drive/${driveId}`, { withCredentials: true });
      setDrive(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load drive.");
    } finally {
      setLoading(false);
    }
  }, [driveId]);

  useEffect(() => { fetchDrive(); }, [fetchDrive]);

  const handleRoundStart = async (round) => {
    if (round.status === "completed") {
      navigate(`/report/${round.sessionId}`);
      return;
    }
    // Mark round in_progress on the drive
    try {
      await axios.patch(
        `http://localhost:8000/drive/${driveId}/round/${round.sessionId}/start`,
        {},
        { withCredentials: true }
      );
    } catch (_) {}
    // Navigate into the interview, threading driveId so it returns here on completion
    navigate(`/interview/${round.sessionId}?driveId=${driveId}`);
  };

  const completedCount = drive?.completedCount || 0;
  const totalRounds    = drive?.totalRounds    || 4;
  const progressPct    = Math.round((completedCount / totalRounds) * 100);
  const allDone        = drive?.status === "completed";

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", fontFamily: "'Sora', 'Inter', sans-serif", color: "white", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap');
        @keyframes ping    { 75%,100% { transform: scale(2); opacity: 0; } }
        @keyframes pulse   { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .nav-link:hover  { color: rgba(255,255,255,0.75) !important; }
        .back-btn:hover  { color: rgba(255,255,255,0.6) !important; }
        .results-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 0 40px rgba(124,58,237,0.5) !important; }
        .round-card-pending:hover { border-color: rgba(255,255,255,0.12) !important; background: rgba(255,255,255,0.03) !important; cursor: pointer !important; }
      `}</style>

      {/* Background glows */}
      <div style={{ pointerEvents: "none", position: "fixed", inset: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -160, left: -160, width: 500, height: 500, borderRadius: "50%", background: "rgba(109,40,217,0.09)", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", bottom: -160, right: -160, width: 420, height: 420, borderRadius: "50%", background: "rgba(79,70,229,0.06)", filter: "blur(100px)" }} />
        {allDone && <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 600, height: 300, borderRadius: "50%", background: "rgba(124,58,237,0.06)", filter: "blur(80px)", animation: "pulse 3s ease-in-out infinite" }} />}
      </div>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", height: 56, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(9,9,11,0.85)", backdropFilter: "blur(16px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed", boxShadow: "0 0 10px rgba(124,58,237,0.8)", display: "inline-block" }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>MockIQ</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {[{ label: "Dashboard", path: "/dashboard" }, { label: "History", path: "/history" }, { label: "Settings", path: "/settings" }].map(({ label, path }) => (
            <span key={label} className="nav-link" onClick={() => navigate(path)} style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", cursor: "pointer", transition: "color 0.2s" }}>{label}</span>
          ))}
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#a78bfa" }}>AK</div>
        </div>
      </nav>

      {/* Main */}
      <div style={{ padding: "84px 28px 60px", maxWidth: 780, margin: "0 auto" }}>

        {/* Back */}
        <button className="back-btn" onClick={() => navigate("/dashboard")} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)", fontSize: 12, fontFamily: "inherit", transition: "color 0.2s", padding: 0 }}>
          <Icon name="back" size={13} /> Back to Dashboard
        </button>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <LivePulse />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Campus Drive</span>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <SkeletonBlock width="40%" height={28} radius={8} />
              <SkeletonBlock width="25%" height={14} />
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.03em", marginBottom: 6 }}>
                {capitalize(drive?.domain)} · {capitalize(drive?.level)}
              </h1>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)" }}>
                {allDone ? "All rounds complete — view your results below" : `${completedCount} of ${totalRounds} rounds completed`}
              </p>
            </>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 32, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>Overall Progress</span>
            {loading ? <SkeletonBlock width={40} height={12} /> : (
              <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: allDone ? "rgba(52,211,153,0.9)" : "rgba(255,255,255,0.6)" }}>
                {completedCount}/{totalRounds}
              </span>
            )}
          </div>

          {/* Progress track */}
          <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ height: "100%", width: loading ? "0%" : `${progressPct}%`, borderRadius: 3, background: allDone ? "linear-gradient(90deg, #34d399, #6ee7b7)" : "linear-gradient(90deg, #7c3aed, #a78bfa)", transition: "width 0.8s ease" }} />
          </div>

          {/* Round pip indicators */}
          <div style={{ display: "flex", gap: 8 }}>
            {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} width="25%" height={32} radius={10} />) : (
              drive?.rounds.map((r, i) => {
                const st = SECTION_STYLE[r.section] || SECTION_STYLE.aptitude;
                return (
                  <div key={i} onClick={() => handleRoundStart(r)} style={{
                    flex: 1, padding: "8px 6px", borderRadius: 10, textAlign: "center",
                    background: r.status === "completed" ? st.bg : "rgba(255,255,255,0.02)",
                    border: `1px solid ${r.status === "completed" ? st.border : "rgba(255,255,255,0.06)"}`,
                    cursor: r.status !== "pending" ? "pointer" : "default",
                    transition: "all 0.2s",
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: r.status === "completed" ? st.color : "rgba(255,255,255,0.2)", marginBottom: 2 }}>{r.label}</div>
                    <div style={{ fontSize: 9, color: r.status === "completed" ? st.color : "rgba(255,255,255,0.15)", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {r.status === "completed" ? `${r.avgScore}%` : r.status === "in_progress" ? "Active" : "Pending"}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Overall score strip (only when all done) */}
        {allDone && drive?.overallAvg !== null && (
          <div style={{
            marginBottom: 24, padding: "20px 24px", borderRadius: 16,
            background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            animation: "fadeIn 0.4s ease",
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(52,211,153,0.6)", marginBottom: 4 }}>Overall Drive Score</div>
              <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "monospace", color: "rgba(52,211,153,0.95)", letterSpacing: "-0.02em" }}>{drive.overallAvg}%</div>
            </div>
            <div style={{ color: "rgba(52,211,153,0.4)" }}><Icon name="trophy" size={36} /></div>
          </div>
        )}

        {/* Round cards */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "24px 26px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <SkeletonBlock width={42} height={42} radius={13} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <SkeletonBlock width="60%" height={14} />
                    <SkeletonBlock width="40%" height={10} />
                  </div>
                </div>
                <SkeletonBlock width="100%" height={44} radius={12} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ padding: 16, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 12, fontSize: 12, color: "rgba(248,113,113,0.8)" }}>{error}</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {drive?.rounds.map((round, i) => (
              <div
                key={round.sessionId}
                className={round.status === "pending" ? "round-card-pending" : ""}
                onClick={round.status === "pending" ? () => handleRoundStart(round) : undefined}
              >
                <RoundCard round={round} index={i} driveId={driveId} onStart={handleRoundStart} />
              </div>
            ))}
          </div>
        )}

        {/* View Full Results CTA */}
        {allDone && !loading && (
          <div style={{ marginTop: 28, animation: "fadeIn 0.5s ease" }}>
            <button
              className="results-btn"
              onClick={() => navigate(`/drive/${driveId}/report`)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                padding: "18px", background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                border: "1px solid rgba(124,58,237,0.4)", borderRadius: 16,
                fontSize: 16, fontWeight: 700, color: "white", cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.25s",
                boxShadow: "0 0 24px rgba(124,58,237,0.3)",
              }}
            >
              <Icon name="trophy" size={18} />
              View Full Results
              <Icon name="arrow" size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ padding: "20px 28px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, maxWidth: 780, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#7c3aed", boxShadow: "0 0 8px rgba(124,58,237,0.7)", display: "inline-block" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>MockIQ © 2025</span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <span key={l} style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default DriveHub;