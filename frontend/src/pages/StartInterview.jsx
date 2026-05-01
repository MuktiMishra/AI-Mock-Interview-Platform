import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { loadSettings } from "./Settings";

const DRIVE_ROUNDS = [
  { section: "aptitude",   label: "Aptitude",     color: "#a78bfa", bg: "rgba(167,139,250,0.1)",  border: "rgba(167,139,250,0.25)" },
  { section: "technical1", label: "Technical I",  color: "#60a5fa", bg: "rgba(96,165,250,0.1)",   border: "rgba(96,165,250,0.25)"  },
  { section: "technical2", label: "Technical II", color: "#34d399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.25)"  },
  { section: "hr",         label: "HR Round",     color: "#f472b6", bg: "rgba(244,114,182,0.1)",  border: "rgba(244,114,182,0.25)" },
];

const DOMAIN_LABELS = { "web-dev": "Web Dev", frontend: "Frontend", backend: "Backend", "devops": "DevOps (Deployment Ops)", "ml": "Machine Learning" };
const LEVEL_LABELS  = { fresher: "Fresher", intermediate: "Intermediate", advanced: "Advanced" };
const levels = [
  { value: "fresher",      label: "Fresher"      },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced",     label: "Advanced"     },
];

function RoundIcon({ section, size = 14 }) {
  const s = { width: size, height: size, flexShrink: 0 };
  if (section === "aptitude") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (section === "technical1" || section === "technical2") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
  if (section === "hr") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
  return null;
}

const StartInterview = () => {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const savedSettings  = loadSettings();

  const [step, setStep]       = useState("configure");
  const [domain, setDomain]   = useState(searchParams.get("domain") || savedSettings.defaultDomain || "web-dev");
  const [level, setLevel]     = useState(savedSettings.defaultLevel || "fresher");
  const [loading, setLoading] = useState(false);

  const estimatedMinutes = Math.ceil((DRIVE_ROUNDS.length * 10 * 40) / 60);

  const startDrive = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/drive/start",
        { domain, level },
        { withCredentials: true }
      );
      navigate(`/drive/${res.data.data.driveId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to start drive");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-[120px]" />
      </div>

      <div className="w-full max-w-[460px] relative">

        {/* ── STEP 1: Configure ── */}
        {step === "configure" && (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-2.5 mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500" />
              </span>
              <span className="text-xs font-semibold tracking-widest uppercase text-white/40">Campus Drive</span>
            </div>
            <div className="mb-8">
              <h1 className="text-[22px] font-bold text-white/90 tracking-tight mb-1.5">Mock Interview Drive</h1>
              <p className="text-[13px] text-white/30">4 rounds · 10 questions each · full campus placement simulation</p>
            </div>

            <div className="mb-5">
              <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/30 mb-2">Domain</label>
              <div className="relative">
                <select value={domain} onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/40 focus:border-violet-500/40 rounded-xl px-4 py-3 text-sm text-white/75 outline-none appearance-none cursor-pointer transition-all duration-200 pr-10">
                  <option value="web-dev">Web Dev</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="devops">Devops</option>
                  <option value="ml">Machine Learning</option>
                </select>
                <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none w-3.5 h-3.5 text-white/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/30 mb-2">Experience Level</label>
              <div className="grid grid-cols-3 gap-2">
                {levels.map(({ value: v, label }) => (
                  <button key={v} onClick={() => setLevel(v)}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${level === v ? "bg-violet-600/15 border border-violet-500/60 text-violet-300" : "bg-white/[0.03] border border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/60"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/[0.02] border border-white/[0.05] rounded-xl mb-6">
              <svg className="w-3.5 h-3.5 flex-shrink-0 text-violet-400/60" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              <span className="text-[11px] text-white/25">Complete rounds in any order · progress saves automatically</span>
            </div>

            <button onClick={() => setStep("preview")}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(124,58,237,0.4)] hover:-translate-y-px active:scale-[0.98]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Preview Drive
            </button>
          </div>
        )}

        {/* ── STEP 2: Preview ── */}
        {step === "preview" && (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500" />
                </span>
                <span className="text-xs font-semibold tracking-widest uppercase text-white/40">Drive Preview</span>
              </div>
              <button onClick={() => setStep("configure")}
                className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors duration-200">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-violet-600/15 border border-violet-500/30 rounded-full text-[11px] font-semibold text-violet-300">{DOMAIN_LABELS[domain]}</span>
              <span className="px-3 py-1 bg-white/[0.04] border border-white/[0.08] rounded-full text-[11px] font-semibold text-white/40">{LEVEL_LABELS[level]}</span>
            </div>

            <div className="mb-6">
              <h1 className="text-[20px] font-bold text-white/90 tracking-tight mb-1">Your Drive Plan</h1>
              <p className="text-[12px] text-white/30">{DRIVE_ROUNDS.length} rounds · 10 questions each · ~{estimatedMinutes} min total</p>
            </div>

            {/* Round cards in preview */}
            <div className="flex flex-col gap-2.5 mb-6">
              {DRIVE_ROUNDS.map((round, i) => (
                <div key={round.section} style={{ background: round.bg, border: `1px solid ${round.border}` }}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl">
                  <div style={{ color: round.color, background: `${round.color}18`, border: `1px solid ${round.color}30` }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <span style={{ color: round.color }} className="flex-1">
                    <RoundIcon section={round.section} size={14} />
                  </span>
                  <span style={{ color: round.color }} className="text-[13px] font-semibold flex-1">{round.label}</span>
                  <span style={{ color: round.color }} className="text-[11px] font-mono opacity-60">10 Q</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/[0.02] border border-white/[0.05] rounded-xl mb-6">
              <svg className="w-3.5 h-3.5 flex-shrink-0 text-violet-400/60" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              <span className="text-[11px] text-white/25">You can complete rounds in any order and resume anytime</span>
            </div>

            <button onClick={startDrive} disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(124,58,237,0.4)] hover:-translate-y-px active:scale-[0.98]">
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" /></svg>Creating Drive…</>
              ) : (
                <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>Begin Drive</>
              )}
            </button>
          </div>
        )}

        <p className="text-center text-[11px] text-white/20 mt-4 tracking-wide">
          Your answers are evaluated by AI in real-time
        </p>
      </div>
    </div>
  );
};

export default StartInterview;