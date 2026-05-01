import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DOMAIN_META = {
  frontend: { name: "Frontend", desc: "React, CSS, JS", icon: "code" },
  backend:  { name: "Backend",  desc: "APIs, DBs, arch", icon: "server" },
  "web-dev":{ name: "Web Dev",  desc: "Full stack mix",  icon: "globe" },
  devops:   { name: "DevOps",   desc: "CI/CD, cloud",    icon: "box" },
};

const DOMAIN_ICON_FOR = (domain = "") => {
  const key = domain.toLowerCase().replace(" ", "-");
  return DOMAIN_META[key]?.icon || "globe";
};

/* ── Icons ── */
function Icon({ name, size = 15 }) {
  const s = { width: size, height: size, flexShrink: 0 };
  if (name === "code")   return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
  if (name === "server") return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>;
  if (name === "clock")  return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
  if (name === "box")    return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>;
  if (name === "chart")  return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
  if (name === "globe")  return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
  if (name === "info")   return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>;
  if (name === "play")   return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>;
  if (name === "arrow-right") return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "spinner") return <svg style={{ ...s, animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" /></svg>;
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

function scoreBadgeStyle(score) {
  if (score >= 80) return { background: "rgba(52,211,153,0.1)",  color: "rgba(52,211,153,0.9)",  border: "1px solid rgba(52,211,153,0.2)"  };
  if (score >= 70) return { background: "rgba(251,191,36,0.1)",  color: "rgba(251,191,36,0.85)", border: "1px solid rgba(251,191,36,0.2)"  };
  return             { background: "rgba(248,113,113,0.1)", color: "rgba(248,113,113,0.85)",border: "1px solid rgba(248,113,113,0.2)" };
}

function SkeletonBlock({ width = "100%", height = 16, radius = 6 }) {
  return <div style={{ width, height, borderRadius: radius, background: "rgba(255,255,255,0.06)", animation: "pulse 1.8s ease-in-out infinite" }} />;
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ── Session row with correct CTA based on status ── */
function SessionRow({ sess, navigate }) {
  const isDrive      = !!sess.driveId;
  const isCompleted  = sess.status === "completed";

  // Where clicking the row goes
  const handleClick = () => {
    if (isDrive) {
      if (isCompleted) {
        navigate(`/drive/${sess.driveId}/report`);
      } else {
        navigate(`/drive/${sess.driveId}`);
      }
    } else {
      if (isCompleted) {
        navigate(`/report/${sess._id}`);
      } else {
        navigate(`/interview/${sess._id}`);
      }
    }
  };

  // CTA pill label + colour
  const ctaLabel = isCompleted ? "View Report" : isDrive ? "Continue Drive" : "Continue";
  const ctaStyle = isCompleted
    ? { background: "rgba(124,58,237,0.12)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" }
    : { background: "rgba(52,211,153,0.1)",  color: "rgba(52,211,153,0.9)", border: "1px solid rgba(52,211,153,0.25)" };

  return (
    <div
      className="history-item"
      onClick={handleClick}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 14px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        transition: "border-color 0.2s, background 0.2s",
        cursor: "pointer",
      }}
    >
      {/* Domain icon */}
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa",
      }}>
        <Icon name={DOMAIN_ICON_FOR(sess.domain)} size={15} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {capitalize(sess.domain)} · {capitalize(sess.level)}
          {isDrive && <span style={{ marginLeft: 6, fontSize: 10, color: "rgba(167,139,250,0.6)", fontWeight: 600 }}>DRIVE</span>}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>
          {formatRelativeTime(sess.completedAt || sess.startedAt)} · {sess.totalAnswers ?? "—"} questions
        </div>
      </div>

      {/* Right side: score (if completed) + CTA pill */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {isCompleted && sess.avgScore != null && (
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", padding: "4px 9px", borderRadius: 8, ...scoreBadgeStyle(sess.avgScore) }}>
            {sess.avgScore}%
          </span>
        )}
        <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 8, letterSpacing: "0.04em", whiteSpace: "nowrap", ...ctaStyle }}>
          {ctaLabel} →
        </span>
      </div>
    </div>
  );
}

/* ── Main Component ── */
const Dashboard = () => {
  const navigate = useNavigate();

  const [data, setData]                 = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/session/sessions", { withCredentials: true });
        setData(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleStartInterview = () => {
    const path = selectedDomain ? `/start?domain=${selectedDomain}` : "/start";
    navigate(path);
  };

  const stats        = data?.stats;
  const sessions     = data?.sessions || [];
  const scoreByDomain = stats?.scoreByDomain || [];

  const STATS = stats
    ? [
        { label: "Total Sessions", value: String(stats.totalSessions),   delta: `↑ ${stats.sessionsThisWeek} this week`, positive: stats.sessionsThisWeek > 0 },
        { label: "Avg Score",      value: `${stats.overallAvg}%`,        delta: stats.overallAvg >= 70 ? "Keep it up!" : "Room to improve", positive: stats.overallAvg >= 70 },
        { label: "Best Domain",    value: stats.bestDomain ? capitalize(stats.bestDomain.name) : "—", delta: stats.bestDomain ? `${stats.bestDomain.count} sessions` : "No data yet", positive: null },
        { label: "Streak",         value: stats.streak > 0 ? `${stats.streak} 🔥` : "0", delta: stats.streak > 0 ? "Days in a row" : "Start one today!", positive: stats.streak > 0 },
      ]
    : [];

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", fontFamily: "'Sora', 'Inter', sans-serif", color: "white", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap');
        @keyframes ping   { 75%,100% { transform: scale(2); opacity: 0; } }
        @keyframes spin   { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse  { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .domain-card:hover   { border-color: rgba(124,58,237,0.4) !important; background: rgba(124,58,237,0.08) !important; }
        .domain-card-selected{ border-color: rgba(124,58,237,0.7) !important; background: rgba(124,58,237,0.13) !important; }
        .nav-link:hover      { color: rgba(255,255,255,0.75) !important; }
        .history-item:hover  { border-color: rgba(255,255,255,0.1) !important; background: rgba(255,255,255,0.035) !important; }
        .start-btn:hover     { background: #6d28d9 !important; transform: translateY(-1px); box-shadow: 0 0 24px rgba(124,58,237,0.4) !important; }
        .start-btn:active    { transform: scale(0.98) !important; }
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
            <span key={label} className="nav-link" onClick={() => navigate(path)} style={{ fontSize: 12, color: label === "Dashboard" ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.35)", cursor: "pointer", transition: "color 0.2s" }}>{label}</span>
          ))}
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#a78bfa" }}>AK</div>
        </div>
      </nav>

      {/* Main */}
      <div style={{ padding: "84px 28px 40px", maxWidth: 1100, margin: "0 auto" }}>

        {error && (
          <div style={{ marginBottom: 20, padding: "12px 16px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 12, fontSize: 12, color: "rgba(248,113,113,0.8)" }}>{error}</div>
        )}

        {/* Greeting */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <LivePulse />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Dashboard</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.03em", marginBottom: 4 }}>Welcome back 👋</h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)" }}>
            {loading ? "Loading your stats…" : stats?.totalSessions > 0
              ? `You've completed ${stats.totalSessions} session${stats.totalSessions !== 1 ? "s" : ""} · keep going`
              : "No sessions yet — start your first interview below"}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <SkeletonBlock width="60%" height={10} /><SkeletonBlock width="40%" height={26} /><SkeletonBlock width="70%" height={10} />
                </div>
              ))
            : STATS.map((s) => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 20px" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>{s.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "monospace", color: "rgba(255,255,255,0.88)", letterSpacing: "-0.02em", marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: s.positive === true ? "rgba(52,211,153,0.8)" : "rgba(255,255,255,0.25)" }}>{s.delta}</div>
                </div>
              ))}
        </div>

        {/* Two-col grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>

          {/* Left col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Recent sessions */}
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Recent sessions</span>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(167,139,250,0.65)", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 6, padding: "3px 8px" }}>Last 5</span>
              </div>

              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.06)", animation: "pulse 1.8s ease-in-out infinite" }} />
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                        <SkeletonBlock width="50%" height={11} /><SkeletonBlock width="70%" height={10} />
                      </div>
                      <SkeletonBlock width={42} height={24} radius={8} />
                    </div>
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <div style={{ padding: "28px 0", textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
                  No sessions yet — complete your first interview to see history here.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {sessions.map((sess, i) => (
                    <SessionRow key={sess._id || i} sess={sess} navigate={navigate} />
                  ))}
                </div>
              )}
            </div>

            {/* Score by domain */}
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 22 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 18 }}>Score by domain</div>
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[80, 60, 45].map((w, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <SkeletonBlock width={70} height={10} />
                      <div style={{ flex: 1 }}><SkeletonBlock width="100%" height={6} radius={3} /></div>
                      <SkeletonBlock width={28} height={10} />
                    </div>
                  ))}
                </div>
              ) : scoreByDomain.length === 0 ? (
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "center", padding: "16px 0" }}>
                  Complete sessions to see domain scores.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {scoreByDomain.map((b) => (
                    <div key={b.domain} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", width: 70, flexShrink: 0 }}>{capitalize(b.domain)}</span>
                      <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${b.avg}%`, borderRadius: 3, background: "linear-gradient(90deg, #7c3aed, #a78bfa)", transition: "width 0.6s ease" }} />
                      </div>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.45)", width: 28, textAlign: "right", flexShrink: 0 }}>{b.avg}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* New session */}
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 22 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>New session</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {Object.entries(DOMAIN_META).map(([key, d]) => (
                  <div
                    key={key}
                    className={`domain-card${selectedDomain === key ? " domain-card-selected" : ""}`}
                    onClick={() => setSelectedDomain(selectedDomain === key ? null : key)}
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 16, cursor: "pointer", transition: "border-color 0.2s, background 0.2s" }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: selectedDomain === key ? "rgba(124,58,237,0.25)" : "rgba(124,58,237,0.12)", border: `1px solid ${selectedDomain === key ? "rgba(124,58,237,0.5)" : "rgba(124,58,237,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, color: "#a78bfa", transition: "background 0.2s, border-color 0.2s" }}>
                      <Icon name={d.icon} size={14} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.65)", marginBottom: 2 }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", lineHeight: 1.5 }}>{d.desc}</div>
                  </div>
                ))}
              </div>

              {selectedDomain && (
                <div style={{ marginBottom: 12, padding: "6px 10px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 8, fontSize: 11, color: "rgba(167,139,250,0.8)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>{DOMAIN_META[selectedDomain].name} selected</span>
                  <span onClick={() => setSelectedDomain(null)} style={{ cursor: "pointer", opacity: 0.6, fontSize: 13, lineHeight: 1 }}>×</span>
                </div>
              )}

              <button className="start-btn" onClick={handleStartInterview} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", background: "#7c3aed", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 700, color: "white", cursor: "pointer", transition: "background 0.2s, transform 0.15s, box-shadow 0.2s", fontFamily: "inherit" }}>
                <Icon name="play" size={16} />
                {selectedDomain ? `Start ${DOMAIN_META[selectedDomain].name} Interview` : "Start Interview"}
              </button>
            </div>

            {/* AI tip */}
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 22 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 14 }}>AI tip for you</div>
              <div style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 14, padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "rgba(167,139,250,0.6)", flexShrink: 0, marginTop: 1 }}><Icon name="info" size={14} /></span>
                {loading ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <SkeletonBlock width="90%" height={10} /><SkeletonBlock width="75%" height={10} />
                  </div>
                ) : (
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}>
                    {stats?.bestDomain
                      ? `Your strongest domain is ${capitalize(stats.bestDomain.name)} — keep practicing the others to round out your profile.`
                      : "Start with a domain you're comfortable with, then push into harder ones. Consistency beats intensity."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: "20px 28px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, maxWidth: 1100, margin: "0 auto" }}>
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

export default Dashboard;