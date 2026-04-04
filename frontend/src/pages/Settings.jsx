import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Settings schema with defaults ──
export const DEFAULT_SETTINGS = {
  defaultDomain: "web-dev",
  defaultLevel:  "fresher",
  timerAmberAt:  20,   // seconds remaining when timer turns amber
  timerRedAt:    10,   // seconds remaining when timer turns red
  warningSound:  true, // beep when timer hits red
  showScoreOnSubmit: true, // show score badge after each answer or only at report
  compactHistory: false,   // compact vs comfortable row height in history
  dashboardGreeting: true, // show the greeting section on dashboard
};

export const SETTINGS_KEY = "mockiq_settings";

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// ── Icons ──
function Icon({ name, size = 15 }) {
  const s = { width: size, height: size, flexShrink: 0 };
  if (name === "back") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (name === "check") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (name === "reset") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" strokeLinecap="round" />
      <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (name === "sliders") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
  if (name === "bell") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
  if (name === "layout") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
  if (name === "mic") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
      <path d="M19 10a7 7 0 0 1-14 0M12 19v3M8 22h8" strokeLinecap="round" />
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

// ── Reusable setting row components ──

function SettingSection({ icon, title, children }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 18, overflow: "hidden", marginBottom: 16,
    }}>
      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <span style={{ color: "#a78bfa" }}><Icon name={icon} size={14} /></span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.03em" }}>
          {title}
        </span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function SettingRow({ label, description, children, last = false }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 20, padding: "16px 22px",
      borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.04)",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 3 }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>
            {description}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

// Toggle switch
function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
        background: value ? "#7c3aed" : "rgba(255,255,255,0.1)",
        position: "relative", transition: "background 0.2s", flexShrink: 0,
        boxShadow: value ? "0 0 12px rgba(124,58,237,0.4)" : "none",
      }}
    >
      <span style={{
        position: "absolute", top: 3, left: value ? 23 : 3,
        width: 18, height: 18, borderRadius: "50%",
        background: "white", transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }} />
    </button>
  );
}

// Segmented control
function Segmented({ options, value, onChange }) {
  return (
    <div style={{
      display: "flex", gap: 4, background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 3,
    }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: "5px 12px", borderRadius: 7, fontSize: 11, fontWeight: 600,
            border: "none", cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.15s",
            background: value === opt.value ? "rgba(124,58,237,0.25)" : "transparent",
            color: value === opt.value ? "#a78bfa" : "rgba(255,255,255,0.35)",
            boxShadow: value === opt.value ? "0 0 8px rgba(124,58,237,0.2)" : "none",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// Slider
function Slider({ value, min, max, step = 1, onChange, color = "#7c3aed" }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative", width: 140, height: 20, display: "flex", alignItems: "center" }}>
        {/* Track */}
        <div style={{
          width: "100%", height: 4, borderRadius: 2,
          background: `linear-gradient(90deg, ${color} ${pct}%, rgba(255,255,255,0.1) ${pct}%)`,
        }} />
        {/* Native input overlaid invisibly for interaction */}
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: "absolute", inset: 0, width: "100%", opacity: 0,
            cursor: "pointer", margin: 0,
          }}
        />
        {/* Thumb */}
        <div style={{
          position: "absolute", left: `calc(${pct}% - 8px)`,
          width: 16, height: 16, borderRadius: "50%",
          background: color, border: "2px solid rgba(9,9,11,0.8)",
          boxShadow: `0 0 8px ${color}80`,
          pointerEvents: "none",
        }} />
      </div>
      <span style={{
        fontSize: 12, fontFamily: "monospace", fontWeight: 700,
        color: "rgba(255,255,255,0.6)", minWidth: 24, textAlign: "right",
      }}>{value}s</span>
    </div>
  );
}

// ── Main Settings Component ──
const Settings = () => {
  const navigate  = useNavigate();
  const [settings, setSettings] = useState(loadSettings);
  const [saved, setSaved]       = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Track unsaved changes
  const [original] = useState(() => loadSettings());

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
    setSaved(false);
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setHasChanges(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setSettings({ ...DEFAULT_SETTINGS });
    setHasChanges(true);
    setSaved(false);
  };

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e) => {
      if (hasChanges) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);

  // Preview the timer colours live based on current settings
  const timerPreviewColor = (sec) => {
    if (sec > settings.timerAmberAt) return "#34d399";
    if (sec > settings.timerRedAt)   return "#fbbf24";
    return "#f87171";
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#09090b",
      fontFamily: "'Sora', 'Inter', sans-serif",
      color: "white", overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap');
        @keyframes ping       { 75%,100% { transform: scale(2); opacity: 0; } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .nav-link:hover  { color: rgba(255,255,255,0.75) !important; }
        .back-btn:hover  { color: rgba(255,255,255,0.6) !important; }
        .save-btn:hover  { background: #6d28d9 !important; box-shadow: 0 0 20px rgba(124,58,237,0.4) !important; }
        .reset-btn:hover { border-color: rgba(248,113,113,0.4) !important; color: rgba(248,113,113,0.7) !important; }
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
                color: label === "Settings" ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.35)",
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
      <div style={{ padding: "84px 28px 80px", maxWidth: 720, margin: "0 auto" }}>

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
            }}>Preferences</span>
          </div>
          <h1 style={{
            fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.9)",
            letterSpacing: "-0.03em", marginBottom: 4,
          }}>Settings</h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)" }}>
            Preferences are saved locally in your browser.
          </p>
        </div>

        {/* ── Section: Interview Defaults ── */}
        <SettingSection icon="mic" title="Interview Defaults">
          <SettingRow
            label="Default Domain"
            description="Pre-selected domain when you open the Start Interview page."
          >
            <Segmented
              value={settings.defaultDomain}
              onChange={(v) => update("defaultDomain", v)}
              options={[
                { value: "web-dev",  label: "Web Dev"  },
                { value: "frontend", label: "Frontend" },
                { value: "backend",  label: "Backend"  },
              ]}
            />
          </SettingRow>

          <SettingRow
            label="Default Level"
            description="Pre-selected experience level on the Start page."
            last
          >
            <Segmented
              value={settings.defaultLevel}
              onChange={(v) => update("defaultLevel", v)}
              options={[
                { value: "fresher",      label: "Fresher"      },
                { value: "intermediate", label: "Intermediate" },
                { value: "advanced",     label: "Advanced"     },
              ]}
            />
          </SettingRow>
        </SettingSection>

        {/* ── Section: Timer ── */}
        <SettingSection icon="sliders" title="Timer Behaviour">
          <SettingRow
            label="Amber Warning At"
            description="Timer bar turns amber at this many seconds remaining."
          >
            <Slider
              value={settings.timerAmberAt}
              min={15} max={35} step={5}
              color="#fbbf24"
              onChange={(v) => {
                update("timerAmberAt", v);
                // keep red always below amber
                if (v <= settings.timerRedAt) update("timerRedAt", v - 5);
              }}
            />
          </SettingRow>

          <SettingRow
            label="Red Warning At"
            description="Timer bar turns red at this many seconds remaining."
          >
            <Slider
              value={settings.timerRedAt}
              min={5} max={settings.timerAmberAt - 5} step={5}
              color="#f87171"
              onChange={(v) => update("timerRedAt", v)}
            />
          </SettingRow>

          {/* Live preview */}
          <div style={{
            margin: "0 22px 18px",
            padding: "14px 16px",
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.2)", marginBottom: 10 }}>
              Live Preview
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[40, 30, settings.timerAmberAt, settings.timerRedAt, 5].map((sec) => (
                <div key={sec} style={{ textAlign: "center", flex: 1 }}>
                  <div style={{
                    height: 4, borderRadius: 2, marginBottom: 6,
                    background: timerPreviewColor(sec),
                    width: `${(sec / 40) * 100}%`,
                    minWidth: 4,
                    transition: "background 0.3s",
                  }} />
                  <span style={{ fontSize: 10, fontFamily: "monospace", color: timerPreviewColor(sec), fontWeight: 700 }}>
                    {sec}s
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SettingSection>

        {/* ── Section: Notifications ── */}
        <SettingSection icon="bell" title="Notifications">
          <SettingRow
            label="Warning Sound"
            description="Play a short beep when the timer enters the red zone."
            last
          >
            <Toggle value={settings.warningSound} onChange={(v) => update("warningSound", v)} />
          </SettingRow>
        </SettingSection>

        {/* ── Section: Display ── */}
        <SettingSection icon="layout" title="Display">
          <SettingRow
            label="Show Score After Each Answer"
            description="Display your score badge immediately after submitting an answer. Turn off to only see scores in the final report."
          >
            <Toggle value={settings.showScoreOnSubmit} onChange={(v) => update("showScoreOnSubmit", v)} />
          </SettingRow>

          <SettingRow
            label="Compact History View"
            description="Use tighter row spacing in the History page."
          >
            <Toggle value={settings.compactHistory} onChange={(v) => update("compactHistory", v)} />
          </SettingRow>

          <SettingRow
            label="Show Dashboard Greeting"
            description="Show the welcome and session count header on the Dashboard."
            last
          >
            <Toggle value={settings.dashboardGreeting} onChange={(v) => update("dashboardGreeting", v)} />
          </SettingRow>
        </SettingSection>

        {/* ── Save / Reset bar ── */}
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40,
          background: "rgba(9,9,11,0.92)", backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "14px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <button
            className="reset-btn"
            onClick={handleReset}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "9px 16px", background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
              fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.3)",
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
            }}
          >
            <Icon name="reset" size={13} />
            Reset to defaults
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Unsaved dot */}
            {hasChanges && (
              <span style={{
                fontSize: 11, color: "rgba(251,191,36,0.7)",
                display: "flex", alignItems: "center", gap: 5,
                animation: "fadeInDown 0.2s ease",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", display: "inline-block" }} />
                Unsaved changes
              </span>
            )}

            {/* Saved confirmation */}
            {saved && (
              <span style={{
                fontSize: 11, color: "rgba(52,211,153,0.8)",
                display: "flex", alignItems: "center", gap: 5,
                animation: "fadeInDown 0.2s ease",
              }}>
                <Icon name="check" size={12} />
                Saved
              </span>
            )}

            <button
              className="save-btn"
              onClick={handleSave}
              disabled={!hasChanges}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "10px 22px", background: hasChanges ? "#7c3aed" : "rgba(124,58,237,0.3)",
                border: "none", borderRadius: 10,
                fontSize: 13, fontWeight: 700, color: hasChanges ? "white" : "rgba(255,255,255,0.3)",
                cursor: hasChanges ? "pointer" : "not-allowed", fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              <Icon name="check" size={14} />
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: "20px 28px 80px", borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12, maxWidth: 720, margin: "0 auto",
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

export default Settings;