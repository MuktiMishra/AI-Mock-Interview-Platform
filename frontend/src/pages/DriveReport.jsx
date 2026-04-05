import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function capitalize(s = "") { return s.charAt(0).toUpperCase() + s.slice(1); }

const SECTION_STYLE = {
  aptitude:   { color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)"  },
  technical1: { color: "#60a5fa", bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.2)"   },
  technical2: { color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)"   },
  hr:         { color: "#f472b6", bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.2)"  },
};

function scoreColor(s) {
  if (s >= 80) return "rgba(52,211,153,0.9)";
  if (s >= 70) return "rgba(251,191,36,0.85)";
  return "rgba(248,113,113,0.85)";
}
function scoreLabel(s) {
  if (s >= 80) return "Excellent";
  if (s >= 70) return "Good";
  if (s >= 40) return "Average";
  return "Needs Work";
}
function scoreBg(s) {
  if (s >= 80) return { bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)" };
  if (s >= 70) return { bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)"  };
  return { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" };
}

function Icon({ name, size = 15 }) {
  const s = { width: size, height: size, flexShrink: 0 };
  if (name === "back") return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "trophy") return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H3V4h3M18 9h3V4h-3M6 9a6 6 0 0 0 12 0M12 15v4M8 19h8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "aptitude") return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "technical1" || name === "technical2") return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
  if (name === "hr") return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
  if (name === "arrow") return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
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

const DriveReport = () => {
  const { driveId } = useParams();
  const navigate    = useNavigate();

  const [drive, setDrive]         = useState(null);
  const [roundData, setRoundData] = useState([]); // { round, answers }
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1. Get drive (includes round statuses + avgScores)
        const driveRes = await axios.get(`http://localhost:8000/drive/${driveId}`, { withCredentials: true });
        const driveData = driveRes.data.data;
        setDrive(driveData);

        // 2. Fetch answers for each completed round
        const enriched = await Promise.all(
          driveData.rounds.map(async (round) => {
            if (round.status !== "completed") return { round, answers: [] };
            try {
              const res = await axios.get(`http://localhost:8000/session/${round.sessionId}/answers`, { withCredentials: true });
              return { round, answers: res.data.data || [] };
            } catch {
              return { round, answers: [] };
            }
          })
        );
        setRoundData(enriched);
      } catch (err) {
        console.error(err);
        setError("Failed to load report.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [driveId]);

  const overallAvg = drive?.overallAvg ?? null;

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", fontFamily: "'Sora', 'Inter', sans-serif", color: "white", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap');
        @keyframes ping  { 75%,100% { transform: scale(2); opacity: 0; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .nav-link:hover { color: rgba(255,255,255,0.75) !important; }
        .back-btn:hover { color: rgba(255,255,255,0.6) !important; }
        .q-row:hover    { border-color: rgba(255,255,255,0.1) !important; background: rgba(255,255,255,0.03) !important; }
      `}</style>

      {/* Background glows */}
      <div style={{ pointerEvents: "none", position: "fixed", inset: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -160, left: -160, width: 500, height: 500, borderRadius: "50%", background: "rgba(109,40,217,0.09)", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", bottom: -160, right: -160, width: 420, height: 420, borderRadius: "50%", background: "rgba(79,70,229,0.06)", filter: "blur(100px)" }} />
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

      <div style={{ padding: "84px 28px 60px", maxWidth: 860, margin: "0 auto" }}>

        {/* Back */}
        <button className="back-btn" onClick={() => navigate(`/drive/${driveId}`)} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)", fontSize: 12, fontFamily: "inherit", transition: "color 0.2s", padding: 0 }}>
          <Icon name="back" size={13} /> Back to Drive Hub
        </button>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <LivePulse />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Drive Report</span>
          </div>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}><SkeletonBlock width="45%" height={28} radius={8} /><SkeletonBlock width="30%" height={14} /></div>
          ) : (
            <>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.03em", marginBottom: 6 }}>
                {capitalize(drive?.domain)} · {capitalize(drive?.level)} · Full Results
              </h1>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)" }}>{drive?.totalRounds} rounds · {roundData.reduce((s, r) => s + r.answers.length, 0)} total answers evaluated</p>
            </>
          )}
        </div>

        {/* Overall score hero */}
        {!loading && overallAvg !== null && (
          <div style={{
            marginBottom: 28, padding: "28px 32px", borderRadius: 20,
            background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            animation: "fadeIn 0.4s ease",
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.25)", marginBottom: 8 }}>Overall Drive Score</div>
              <div style={{ fontSize: 52, fontWeight: 700, fontFamily: "monospace", letterSpacing: "-0.03em", color: scoreColor(overallAvg), lineHeight: 1 }}>{overallAvg}%</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: scoreColor(overallAvg), marginTop: 6, opacity: 0.8 }}>{scoreLabel(overallAvg)}</div>
            </div>
            {/* Mini round scores */}
            <div style={{ display: "flex", gap: 10 }}>
              {drive?.rounds.map((r) => {
                const st = SECTION_STYLE[r.section] || SECTION_STYLE.aptitude;
                return (
                  <div key={r.section} style={{ textAlign: "center", padding: "12px 14px", borderRadius: 12, background: st.bg, border: `1px solid ${st.border}`, minWidth: 70 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: st.color, marginBottom: 6, opacity: 0.7 }}>{r.label.split(" ")[0]}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: st.color }}>
                      {r.avgScore !== null ? `${r.avgScore}%` : "—"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Score by domain bar chart */}
        {!loading && drive?.rounds && (
          <div style={{ marginBottom: 24, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "22px 24px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 18 }}>Performance by Round</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {drive.rounds.map((r) => {
                const st = SECTION_STYLE[r.section] || SECTION_STYLE.aptitude;
                const pct = r.avgScore || 0;
                return (
                  <div key={r.section} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 11, color: st.color, width: 88, flexShrink: 0, fontWeight: 600 }}>{r.label}</span>
                    <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: `linear-gradient(90deg, ${st.color}80, ${st.color})`, transition: "width 0.8s ease" }} />
                    </div>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: r.avgScore !== null ? st.color : "rgba(255,255,255,0.2)", width: 36, textAlign: "right", flexShrink: 0, fontWeight: 700 }}>
                      {r.avgScore !== null ? `${r.avgScore}%` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Per-round Q&A breakdown */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 22 }}>
                <SkeletonBlock width="30%" height={16} radius={6} style={{ marginBottom: 16 }} />
                {Array.from({ length: 3 }).map((__, j) => (
                  <div key={j} style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                    <SkeletonBlock width="85%" height={12} />
                    <SkeletonBlock width="60%" height={10} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ padding: 16, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 12, fontSize: 12, color: "rgba(248,113,113,0.8)" }}>{error}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {roundData.map(({ round, answers }) => {
              const st = SECTION_STYLE[round.section] || SECTION_STYLE.aptitude;
              return (
                <div key={round.section} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden" }}>
                  {/* Round header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: st.bg }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: st.color }}><Icon name={round.section} size={15} /></span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: st.color }}>{round.label}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{answers.length} questions</span>
                    </div>
                    {round.avgScore !== null && (
                      <div style={{ padding: "4px 12px", borderRadius: 8, background: scoreBg(round.avgScore).bg, border: `1px solid ${scoreBg(round.avgScore).border}`, fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: scoreColor(round.avgScore) }}>
                        {round.avgScore}% · {scoreLabel(round.avgScore)}
                      </div>
                    )}
                  </div>

                  {/* Q&A rows */}
                  <div style={{ padding: "8px 0" }}>
                    {answers.length === 0 ? (
                      <div style={{ padding: "20px 22px", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>No answers recorded for this round.</div>
                    ) : answers.map((ans, ai) => (
                      <div key={ans._id || ai} className="q-row" style={{ padding: "14px 22px", borderBottom: ai < answers.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "all 0.15s", cursor: "default" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: ans.transcript ? 10 : 0 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>Q{ai + 1}</span>
                              <div style={{ width: 1, height: 10, background: "rgba(255,255,255,0.1)" }} />
                              <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: st.color, opacity: 0.7 }}>{round.section}</span>
                            </div>
                            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, fontWeight: 500 }}>
                              {ans.questionId?.text || "Question not available"}
                            </p>
                          </div>
                          <div style={{ flexShrink: 0, textAlign: "right" }}>
                            <div style={{ padding: "5px 10px", borderRadius: 8, background: scoreBg(ans.score).bg, border: `1px solid ${scoreBg(ans.score).border}`, fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: scoreColor(ans.score), marginBottom: 3 }}>
                              {ans.score}%
                            </div>
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>{scoreLabel(ans.score)}</div>
                          </div>
                        </div>

                        {/* Transcript */}
                        {ans.transcript && (
                          <div style={{ padding: "10px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10 }}>
                            <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.2)", marginBottom: 5 }}>Your Answer</div>
                            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>{ans.transcript}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Start new drive CTA */}
        {!loading && (
          <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
            <button onClick={() => navigate(`/drive/${driveId}`)} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
              ← Back to Hub
            </button>
            <button onClick={() => navigate("/start")} style={{ flex: 1, padding: "14px", background: "#7c3aed", border: "none", borderRadius: 14, fontSize: 13, fontWeight: 700, color: "white", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
              Start New Drive →
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ padding: "20px 28px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, maxWidth: 860, margin: "0 auto" }}>
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

export default DriveReport;