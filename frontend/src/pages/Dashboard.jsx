import { useNavigate } from "react-router-dom";

const STATS = [
  { label: "Total Sessions", value: "24", delta: "↑ 4 this week", positive: true },
  { label: "Avg Score", value: "78%", delta: "↑ 6% vs last week", positive: true },
  { label: "Best Domain", value: "Frontend", delta: "3 sessions", positive: null },
  { label: "Streak", value: "5 🔥", delta: "Days in a row", positive: true },
];

const SESSIONS = [
  {
    domain: "Frontend", level: "Intermediate", meta: "Today · 5 questions · 3m 12s",
    score: 88, icon: "code",
  },
  {
    domain: "Backend", level: "Advanced", meta: "Yesterday · 5 questions · 4m 07s",
    score: 72, icon: "server",
  },
  {
    domain: "Web Dev", level: "Fresher", meta: "2 days ago · 5 questions · 2m 55s",
    score: 91, icon: "clock",
  },
  {
    domain: "Backend", level: "Intermediate", meta: "3 days ago · 5 questions · 3m 40s",
    score: 61, icon: "box",
  },
  {
    domain: "Frontend", level: "Fresher", meta: "4 days ago · 5 questions · 2m 30s",
    score: 83, icon: "chart",
  },
];

const DOMAINS = [
  { key: "frontend", name: "Frontend", desc: "React, CSS, JS", icon: "code" },
  { key: "backend", name: "Backend", desc: "APIs, DBs, arch", icon: "server" },
  { key: "web-dev", name: "Web Dev", desc: "Full stack mix", icon: "globe" },
  { key: "devops", name: "DevOps", desc: "CI/CD, cloud", icon: "box" },
];

const BARS = [
  { label: "Frontend", pct: 87 },
  { label: "Web Dev", pct: 79 },
  { label: "Backend", pct: 66 },
];

/* ── icons ── */
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
  if (name === "clock") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
  if (name === "box") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  );
  if (name === "chart") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
  if (name === "globe") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
  if (name === "info") return (
    <svg style={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  );
  if (name === "play") return (
    <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
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
      <span style={{
        position: "relative", width: 8, height: 8, borderRadius: "50%", background: "#7c3aed",
      }} />
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

/* ── main component ── */
const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh", background: "#09090b", fontFamily: "'Sora', 'Inter', sans-serif",
      color: "white", overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap');
        @keyframes ping { 75%,100% { transform: scale(2); opacity: 0; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .domain-card:hover { border-color: rgba(124,58,237,0.4) !important; background: rgba(124,58,237,0.08) !important; }
        .nav-link:hover { color: rgba(255,255,255,0.75) !important; }
        .history-item:hover { border-color: rgba(255,255,255,0.1) !important; background: rgba(255,255,255,0.035) !important; }
        .start-btn:hover { background: #6d28d9 !important; transform: translateY(-1px); box-shadow: 0 0 24px rgba(124,58,237,0.4) !important; }
        .start-btn:active { transform: scale(0.98) !important; }
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
          {["Dashboard", "History", "Settings"].map((l) => (
            <span key={l} className="nav-link" style={{
              fontSize: 12, color: l === "Dashboard" ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.35)",
              cursor: "pointer", transition: "color 0.2s",
            }}>{l}</span>
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
      <div style={{ padding: "84px 28px 40px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Greeting */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <LivePulse />
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
            }}>Dashboard</span>
          </div>
          <h1 style={{
            fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.9)",
            letterSpacing: "-0.03em", marginBottom: 4,
          }}>Welcome back, Aryan</h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)" }}>
            You've completed 8 sessions this month · keep going
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12, marginBottom: 20,
        }}>
          {STATS.map((s) => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "18px 20px",
            }}>
              <div style={{
                fontSize: 10, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.08em", color: "rgba(255,255,255,0.28)", marginBottom: 10,
              }}>{s.label}</div>
              <div style={{
                fontSize: 26, fontWeight: 700, fontFamily: "monospace",
                color: "rgba(255,255,255,0.88)", letterSpacing: "-0.02em", marginBottom: 4,
              }}>{s.value}</div>
              <div style={{
                fontSize: 11,
                color: s.positive === true ? "rgba(52,211,153,0.8)" : "rgba(255,255,255,0.25)",
              }}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Two-col grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>

          {/* Left col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Recent sessions */}
            <div style={{
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 18, padding: 22,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Recent sessions</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "rgba(167,139,250,0.65)", background: "rgba(124,58,237,0.12)",
                  border: "1px solid rgba(124,58,237,0.25)", borderRadius: 6, padding: "3px 8px",
                }}>Last 5</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {SESSIONS.map((sess, i) => (
                  <div key={i} className="history-item" style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12,
                    transition: "border-color 0.2s, background 0.2s", cursor: "default",
                  }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 10,
                      background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, color: "#a78bfa",
                    }}>
                      <Icon name={sess.icon} size={15} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)",
                        marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>{sess.domain} · {sess.level}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>{sess.meta}</div>
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: 700, fontFamily: "monospace",
                      padding: "4px 9px", borderRadius: 8, ...scoreBadgeStyle(sess.score),
                    }}>{sess.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Score by domain */}
            <div style={{
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 18, padding: 22,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 18 }}>
                Score by domain
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {BARS.map((b) => (
                  <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", width: 70, flexShrink: 0 }}>{b.label}</span>
                    <div style={{
                      flex: 1, height: 6, background: "rgba(255,255,255,0.06)",
                      borderRadius: 3, overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%", width: `${b.pct}%`, borderRadius: 3,
                        background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
                      }} />
                    </div>
                    <span style={{
                      fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.45)",
                      width: 28, textAlign: "right", flexShrink: 0,
                    }}>{b.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* New session */}
            <div style={{
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 18, padding: 22,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>
                New session
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {DOMAINS.map((d) => (
                  <div key={d.key} className="domain-card" style={{
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14, padding: 16, cursor: "pointer",
                    transition: "border-color 0.2s, background 0.2s",
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 9,
                      background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 10, color: "#a78bfa",
                    }}>
                      <Icon name={d.icon} size={14} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.65)", marginBottom: 2 }}>
                      {d.name}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", lineHeight: 1.5 }}>
                      {d.desc}
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="start-btn"
                onClick={() => navigate("/start")}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 8, padding: "14px", background: "#7c3aed", border: "none",
                  borderRadius: 14, fontSize: 14, fontWeight: 700, color: "white",
                  cursor: "pointer", transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
                  fontFamily: "inherit",
                }}
              >
                <Icon name="play" size={16} />
                Start Interview
              </button>
            </div>

            {/* AI tip */}
            <div style={{
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 18, padding: 22,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 14 }}>
                AI tip for you
              </div>
              <div style={{
                background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)",
                borderRadius: 14, padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start",
              }}>
                <span style={{ color: "rgba(167,139,250,0.6)", flexShrink: 0, marginTop: 1 }}>
                  <Icon name="info" size={14} />
                </span>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}>
                  Your backend scores dip under time pressure. Try answering the "why" before the "how" — interviewers reward structured thinking over speed.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: "20px 28px", borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12, maxWidth: 1100, margin: "0 auto",
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

export default Dashboard;