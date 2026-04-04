import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* ── Icons ── */
function Icon({ name, size = 15 }) {
  const s = { width: size, height: size, flexShrink: 0 };
  if (name === "code") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
  if (name === "server") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
    </svg>
  );
  if (name === "globe") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
  if (name === "box") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  );
  if (name === "clock") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
  if (name === "arrow-right") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (name === "filter") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (name === "sort") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" />
    </svg>
  );
  if (name === "empty") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h6M9 13h4" strokeLinecap="round" />
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
      <span style={{
        position: "absolute", width: 8, height: 8, borderRadius: "50%",
        background: "rgba(167,139,250,0.75)",
        animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
      }} />
      <span style={{ position: "relative", width: 8, height: 8, borderRadius: "50%", background: "#7c3aed" }} />
    </span>
  );
}

function scoreBadgeStyle(score) {
  if (score >= 80) return {
    background: "rgba(52,211,153,0.1)", color: "rgba(52,211,153,0.9)",
    border: "1px solid rgba(52,211,153,0.2)",
  };
  if (score >= 70) return {
    background: "rgba(251,191,36,0.1)", color: "rgba(251,191,36,0.85)",
    border: "1px solid rgba(251,191,36,0.2)",
  };
  return {
    background: "rgba(248,113,113,0.1)", color: "rgba(248,113,113,0.85)",
    border: "1px solid rgba(248,113,113,0.2)",
  };
}

function scoreLabel(score) {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 40) return "Average";
  return "Poor";
}

function SkeletonBlock({ width = "100%", height = 14, radius = 6 }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: "rgba(255,255,255,0.06)",
      animation: "pulse 1.8s ease-in-out infinite",
    }} />
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return formatDate(dateStr);
}

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const DOMAIN_ICON = {
  frontend: "code",
  backend: "server",
  "web-dev": "globe",
  devops: "box",
};

const LEVEL_COLORS = {
  fresher:      { color: "rgba(52,211,153,0.85)",  bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.2)"  },
  intermediate: { color: "rgba(251,191,36,0.85)",  bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.2)"  },
  advanced:     { color: "rgba(248,113,113,0.85)", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.2)" },
};

/* ── Main Component ── */
const History = () => {
  const navigate = useNavigate();

  const [sessions, setSessions]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // Filters
  const [domainFilter, setDomainFilter] = useState("all");
  const [levelFilter, setLevelFilter]   = useState("all");
  const [sortBy, setSortBy]             = useState("newest"); // newest | oldest | score-high | score-low

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/session/sessions", {
          withCredentials: true,
        });
        // We want ALL sessions for history, not just last 5
        // The controller returns enriched sessions — use them
        setSessions(res.data.data.sessions || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load session history.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  // Derive unique domains from actual data for filter pills
  const availableDomains = [...new Set(sessions.map((s) => s.domain))];

  // Apply filters + sort
  const filtered = sessions
    .filter((s) => domainFilter === "all" || s.domain === domainFilter)
    .filter((s) => levelFilter === "all" || s.level === levelFilter)
    .sort((a, b) => {
      if (sortBy === "newest")     return new Date(b.completedAt) - new Date(a.completedAt);
      if (sortBy === "oldest")     return new Date(a.completedAt) - new Date(b.completedAt);
      if (sortBy === "score-high") return b.avgScore - a.avgScore;
      if (sortBy === "score-low")  return a.avgScore - b.avgScore;
      return 0;
    });

  // Summary stats for the top bar
  const avgScore = sessions.length
    ? Math.round(sessions.reduce((s, x) => s + x.avgScore, 0) / sessions.length)
    : 0;
  const bestSession = sessions.length
    ? sessions.reduce((best, s) => (s.avgScore > best.avgScore ? s : best), sessions[0])
    : null;

  return (
    <div style={{
      minHeight: "100vh", background: "#09090b",
      fontFamily: "'Sora', 'Inter', sans-serif",
      color: "white", overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap');
        @keyframes ping  { 75%,100% { transform: scale(2); opacity: 0; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .nav-link:hover     { color: rgba(255,255,255,0.75) !important; }
        .pill:hover         { border-color: rgba(124,58,237,0.5) !important; color: rgba(255,255,255,0.7) !important; }
        .session-row:hover  { border-color: rgba(124,58,237,0.3) !important; background: rgba(124,58,237,0.04) !important; }
        .back-btn:hover     { color: rgba(255,255,255,0.6) !important; }
      `}</style>

      {/* Background glows */}
      <div style={{ pointerEvents: "none", position: "fixed", inset: 0, overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: -160, left: -160, width: 500, height: 500,
          borderRadius: "50%", background: "rgba(109,40,217,0.09)", filter: "blur(100px)",
        }} />
        <div style={{
          position: "absolute", bottom: -160, right: -160, width: 420, height: 420,
          borderRadius: "50%", background: "rgba(79,70,229,0.06)", filter: "blur(100px)",
        }} />
      </div>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", height: 56,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(9,9,11,0.85)", backdropFilter: "blur(16px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%", background: "#7c3aed",
            boxShadow: "0 0 10px rgba(124,58,237,0.8)", display: "inline-block",
          }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>MockIQ</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {[
            { label: "Dashboard", path: "/dashboard" },
            { label: "History",   path: "/history"   },
            { label: "Settings",  path: "/settings"  },
          ].map(({ label, path }) => (
            <span
              key={label}
              className="nav-link"
              onClick={() => navigate(path)}
              style={{
                fontSize: 12,
                color: label === "History" ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.35)",
                cursor: "pointer", transition: "color 0.2s",
              }}
            >{label}</span>
          ))}
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 600, color: "#a78bfa",
          }}>AK</div>
        </div>
      </nav>

      {/* Main */}
      <div style={{ padding: "84px 28px 60px", maxWidth: 900, margin: "0 auto" }}>

        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <button
            className="back-btn"
            onClick={() => navigate("/dashboard")}
            style={{
              display: "flex", alignItems: "center", gap: 6, marginBottom: 16,
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.25)", fontSize: 12, fontFamily: "inherit",
              transition: "color 0.2s", padding: 0,
            }}
          >
            <Icon name="back" size={13} />
            Back to Dashboard
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <LivePulse />
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
            }}>Session History</span>
          </div>
          <h1 style={{
            fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.9)",
            letterSpacing: "-0.03em", marginBottom: 4,
          }}>All Interviews</h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)" }}>
            {loading ? "Loading…" : `${sessions.length} completed session${sessions.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Summary strip */}
        {!loading && sessions.length > 0 && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12, marginBottom: 24,
          }}>
            {[
              { label: "Total Sessions", value: sessions.length },
              { label: "Average Score",  value: `${avgScore}%` },
              {
                label: "Best Session",
                value: bestSession ? `${bestSession.avgScore}%` : "—",
                sub: bestSession ? `${capitalize(bestSession.domain)} · ${capitalize(bestSession.level)}` : "",
              },
            ].map((card) => (
              <div key={card.label} style={{
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14, padding: "16px 18px",
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 600, textTransform: "uppercase",
                  letterSpacing: "0.08em", color: "rgba(255,255,255,0.28)", marginBottom: 8,
                }}>{card.label}</div>
                <div style={{
                  fontSize: 22, fontWeight: 700, fontFamily: "monospace",
                  color: "rgba(255,255,255,0.88)", letterSpacing: "-0.02em",
                  marginBottom: card.sub ? 2 : 0,
                }}>{card.value}</div>
                {card.sub && (
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{card.sub}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Filters + sort row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12, marginBottom: 16,
        }}>
          {/* Domain + Level filter pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.2)", fontSize: 11 }}>
              <Icon name="filter" size={11} /> Filter
            </span>

            {/* Domain pills */}
            {["all", ...availableDomains].map((d) => (
              <button
                key={d}
                className="pill"
                onClick={() => setDomainFilter(d)}
                style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                  cursor: "pointer", border: "1px solid", fontFamily: "inherit",
                  transition: "all 0.15s",
                  background: domainFilter === d ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.03)",
                  borderColor: domainFilter === d ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)",
                  color: domainFilter === d ? "rgba(167,139,250,0.9)" : "rgba(255,255,255,0.35)",
                }}
              >
                {d === "all" ? "All Domains" : capitalize(d)}
              </button>
            ))}

            {/* Divider */}
            <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.08)" }} />

            {/* Level pills */}
            {["all", "fresher", "intermediate", "advanced"].map((l) => (
              <button
                key={l}
                className="pill"
                onClick={() => setLevelFilter(l)}
                style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                  cursor: "pointer", border: "1px solid", fontFamily: "inherit",
                  transition: "all 0.15s",
                  background: levelFilter === l ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.03)",
                  borderColor: levelFilter === l ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)",
                  color: levelFilter === l ? "rgba(167,139,250,0.9)" : "rgba(255,255,255,0.35)",
                }}
              >
                {l === "all" ? "All Levels" : capitalize(l)}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.2)", fontSize: 11 }}>
              <Icon name="sort" size={11} /> Sort
            </span>
            <div style={{ position: "relative" }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10, padding: "6px 28px 6px 12px", fontSize: 11,
                  color: "rgba(255,255,255,0.55)", outline: "none", cursor: "pointer",
                  appearance: "none", fontFamily: "inherit",
                }}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="score-high">Score: High → Low</option>
                <option value="score-low">Score: Low → High</option>
              </select>
              <svg style={{
                position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                width: 10, height: 10, pointerEvents: "none", color: "rgba(255,255,255,0.25)",
              }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginBottom: 14 }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {(domainFilter !== "all" || levelFilter !== "all") && " (filtered)"}
          </div>
        )}

        {/* Session list */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "16px 18px", background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.06)", animation: "pulse 1.8s ease-in-out infinite", flexShrink: 0 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
                  <SkeletonBlock width="35%" height={12} />
                  <SkeletonBlock width="55%" height={10} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 7 }}>
                  <SkeletonBlock width={52} height={24} radius={8} />
                  <SkeletonBlock width={60} height={10} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{
            padding: "16px", background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.2)", borderRadius: 12,
            fontSize: 12, color: "rgba(248,113,113,0.8)",
          }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{
            padding: "60px 20px", textAlign: "center",
            background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 18,
          }}>
            <div style={{ color: "rgba(255,255,255,0.12)", marginBottom: 12, display: "flex", justifyContent: "center" }}>
              <Icon name="empty" size={32} />
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>
              {sessions.length === 0 ? "No sessions yet" : "No sessions match your filters"}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>
              {sessions.length === 0
                ? "Complete your first interview to see it here."
                : "Try adjusting the domain or level filter."}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((sess, i) => {
              const levelStyle = LEVEL_COLORS[sess.level] || LEVEL_COLORS.fresher;
              const domainKey = sess.domain?.toLowerCase().replace(" ", "-");
              const iconName = DOMAIN_ICON[domainKey] || "globe";

              return (
                <div
                  key={sess._id || i}
                  className="session-row"
                  onClick={() => navigate(`/report/${sess._id}`)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "16px 18px", background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14,
                    cursor: "pointer", transition: "border-color 0.2s, background 0.2s",
                  }}
                >
                  {/* Domain icon */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa",
                  }}>
                    <Icon name={iconName} size={16} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap",
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
                        {capitalize(sess.domain)}
                      </span>
                      {/* Level badge */}
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 6,
                        background: levelStyle.bg, color: levelStyle.color, border: `1px solid ${levelStyle.border}`,
                      }}>
                        {capitalize(sess.level)}
                      </span>
                    </div>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                        <Icon name="clock" size={11} />
                        {formatRelativeTime(sess.completedAt)}
                      </span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>·</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                        {sess.totalAnswers} question{sess.totalAnswers !== 1 ? "s" : ""}
                      </span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>·</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                        {formatDate(sess.completedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Score + label + chevron */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        fontSize: 13, fontWeight: 700, fontFamily: "monospace",
                        padding: "5px 10px", borderRadius: 8, marginBottom: 4,
                        ...scoreBadgeStyle(sess.avgScore),
                      }}>
                        {sess.avgScore}%
                      </div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
                        {scoreLabel(sess.avgScore)}
                      </div>
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.15)" }}>
                      <Icon name="arrow-right" size={14} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        padding: "20px 28px", borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12, maxWidth: 900, margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", background: "#7c3aed",
            boxShadow: "0 0 8px rgba(124,58,237,0.7)", display: "inline-block",
          }} />
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

export default History;