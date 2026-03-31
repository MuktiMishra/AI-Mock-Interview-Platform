import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StartInterview = () => {
  const navigate = useNavigate();
  const [domain, setDomain] = useState("web-dev");
  const [level, setLevel] = useState("fresher");
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/session/start",
        { domain, level },
        { withCredentials: true }
      );
      navigate(`/interview/${res.data.data.sessionId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const levels = [
    { value: "fresher", label: "Fresher" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-[120px]" />
      </div>

      <div className="w-full max-w-[440px] relative">
        {/* Main card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 shadow-2xl backdrop-blur-sm">

          {/* Header */}
          <div className="flex items-center gap-2.5 mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500" />
            </span>
            <span className="text-xs font-semibold tracking-widest uppercase text-white/40">
              AI Interview
            </span>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-[22px] font-bold text-white/90 tracking-tight mb-1.5">
              Mock Interview
            </h1>
            <p className="text-[13px] text-white/30">
              Configure your session and start when ready
            </p>
          </div>

          {/* Domain */}
          <div className="mb-5">
            <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/30 mb-2">
              Domain
            </label>
            <div className="relative">
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/40 focus:border-violet-500/40 rounded-xl px-4 py-3 text-sm text-white/75 outline-none appearance-none cursor-pointer transition-all duration-200 pr-10"
              >
                <option value="web-dev">Web Dev</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
              </select>
              <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none w-3.5 h-3.5 text-white/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Level — segmented buttons */}
          <div className="mb-8">
            <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/30 mb-2">
              Experience Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {levels.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setLevel(value)}
                  className={`py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    level === value
                      ? "bg-violet-600/15 border border-violet-500/60 text-violet-300"
                      : "bg-white/[0.03] border border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/60"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Info strip */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/[0.02] border border-white/[0.05] rounded-xl mb-6">
            <svg className="w-3.5 h-3.5 flex-shrink-0 text-violet-400/60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            <span className="text-[11px] text-white/25">
              40 seconds per question · answers auto-submit on timeout
            </span>
          </div>

          {/* Start button */}
          <button
            onClick={startInterview}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(124,58,237,0.4)] hover:-translate-y-px active:scale-[0.98]"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                </svg>
                Starting…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
                Start Interview
              </>
            )}
          </button>
        </div>

        {/* Footer hint */}
        <p className="text-center text-[11px] text-white/20 mt-4 tracking-wide">
          Your answers are evaluated by AI in real-time
        </p>
      </div>
    </div>
  );
};

export default StartInterview;