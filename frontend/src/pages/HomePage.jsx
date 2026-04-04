import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
        <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-1.5 14.9A6.002 6.002 0 0 1 6 10H4a8.001 8.001 0 0 0 7 7.938V20H8v2h8v-2h-3v-2.062A8.001 8.001 0 0 0 20 10h-2a6 6 0 0 1-4.5 5.9z" />
      </svg>
    ),
    title: "Voice-based answers",
    desc: "Speak your answers just like a real interview. No typing — your voice is transcribed and analyzed instantly.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Timed pressure mode",
    desc: "A live countdown forces you to think fast. Auto-submit when time's up — just like the real thing.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Detailed report card",
    desc: "After every session, get a full breakdown of your performance — clarity, depth, confidence, and more.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
    title: "Role-specific questions",
    desc: "Choose your domain — product, engineering, design, data — and get questions tailored to your target role.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Progress tracking",
    desc: "Watch your scores improve over multiple sessions. Identify weak spots and target them directly.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    title: "AI follow-up questions",
    desc: "The AI digs deeper based on your answers — no two sessions are exactly alike.",
  },
];

const STEPS = [
  {
    num: "01 —",
    title: "Pick your role",
    desc: "Choose a job category and experience level. We'll load questions curated for that path.",
  },
  {
    num: "02 —",
    title: "Answer live",
    desc: "Record your answers under timed conditions. Speak naturally — our AI listens and understands.",
  },
  {
    num: "03 —",
    title: "Get your report",
    desc: "Receive a scored, actionable report. Repeat until you're confident and ready.",
  },
];

const ROLES = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "Marketing Manager",
  "Business Analyst",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "Frontend Developer",
  "Sales Executive",
  "Finance Analyst",
  "Engineering Manager",
];

const STATS = [
  { value: "12k+", label: "Sessions run" },
  { value: "94%", label: "Confidence boost" },
  { value: "30+", label: "Role categories" },
  { value: "<2min", label: "To get started" },
];

/* ── small reusable pieces ── */

function LivePulse({ size = "sm" }) {
  const dim = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";
  return (
    <span className="relative flex">
      <span className={`animate-ping absolute inline-flex ${dim} rounded-full bg-violet-400 opacity-75`} />
      <span className={`relative inline-flex rounded-full ${dim} bg-violet-500`} />
    </span>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group relative bg-white/[0.025] border border-white/[0.07] rounded-[18px] p-7 overflow-hidden transition-all duration-300 hover:bg-white/[0.04] hover:border-violet-500/30 hover:-translate-y-0.5">
      {/* hover gradient overlay */}
      <div className="absolute inset-[-1px] rounded-[18px] bg-gradient-to-br from-violet-500/15 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative">
        <div className="w-[42px] h-[42px] rounded-xl bg-violet-600/15 border border-violet-500/25 flex items-center justify-center mb-[18px] text-violet-400">
          {icon}
        </div>
        <p className="text-[15px] font-semibold text-white/80 mb-2">{title}</p>
        <p className="text-[13px] text-white/35 leading-relaxed font-light">{desc}</p>
      </div>
    </div>
  );
}

/* ── main component ── */

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-['Sora',sans-serif] overflow-x-hidden">

      {/* ── background glows ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-[120px]" />
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-violet-500/5 blur-[100px]" />
      </div>

      {/* ── nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-10 h-16 flex items-center justify-between border-b border-white/[0.05] bg-[#09090b]/80 backdrop-blur-[16px]">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
          <span className="text-[15px] font-semibold tracking-tight text-white/90">MockIQ</span>
        </div>
        <div className="flex items-center gap-8">
          <span className="text-[13px] text-white/40 hover:text-white/80 transition-colors cursor-pointer">Features</span>
          <span className="text-[13px] text-white/40 hover:text-white/80 transition-colors cursor-pointer">Roles</span>
          <span className="text-[13px] text-white/40 hover:text-white/80 transition-colors cursor-pointer">Pricing</span>
          <button
            onClick={() => navigate("/login")}
            className="px-[18px] py-2 bg-violet-600/20 border border-violet-500/35 rounded-[10px] text-[13px] font-medium text-violet-300/90 hover:bg-violet-600/35 hover:border-violet-400/50 transition-all duration-200"
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* ── hero ── */}
      <section className="pt-40 pb-24 px-6 text-center relative">
        {/* badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-violet-600/10 border border-violet-500/25 rounded-full mb-8">
          <LivePulse size="sm" />
          <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-violet-300/80">
            AI-Powered Interview Practice
          </span>
        </div>

        <h1 className="text-[clamp(40px,7vw,76px)] font-bold leading-[1.08] tracking-[-0.04em] text-white/92 mb-6">
          Ace your next
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-300 bg-clip-text text-transparent">
            interview
          </span>{" "}
          with AI
        </h1>

        <p className="text-[17px] text-white/38 font-light max-w-[500px] mx-auto mb-11 leading-[1.7]">
          Practice with a real-time AI interviewer. Get instant feedback, improve your answers, and walk in confident.
        </p>

        <div className="flex items-center justify-center gap-3.5 flex-wrap">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-7 py-3.5 bg-violet-600 hover:bg-violet-500 rounded-[14px] text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] shadow-[0_0_30px_rgba(124,58,237,0.35)] active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Start Interview
          </button>
          <button className="flex items-center gap-2 px-7 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.09] hover:border-white/[0.16] rounded-[14px] text-[15px] font-medium text-white/55 hover:text-white/85 transition-all duration-200 active:scale-[0.98]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none" />
            </svg>
            Watch demo
          </button>
        </div>
      </section>

      {/* ── stats strip ── */}
      <div className="flex items-center justify-center gap-12 flex-wrap px-6 py-7 border-t border-b border-white/[0.05] bg-white/[0.015]">
        {STATS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-12">
            <div className="text-center">
              <div className="text-[26px] font-bold tracking-tight font-mono text-white/88">{s.value}</div>
              <div className="text-[11px] text-white/28 uppercase tracking-[0.08em] mt-0.5">{s.label}</div>
            </div>
            {i < STATS.length - 1 && (
              <div className="w-px h-9 bg-white/[0.07]" />
            )}
          </div>
        ))}
      </div>

      {/* ── features ── */}
      <section className="py-[90px] px-6 max-w-[1100px] mx-auto">
        <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-violet-500/70 mb-3.5">What you get</p>
        <h2 className="text-[clamp(26px,4vw,40px)] font-bold tracking-tight text-white/88 mb-3.5">Built for real preparation</h2>
        <p className="text-[15px] text-white/35 max-w-[460px] leading-[1.7] font-light">
          Every feature is designed to simulate the pressure of a real interview, so you perform when it counts.
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mt-12">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ── how it works ── */}
      <div className="py-20 px-6 bg-white/[0.012] border-t border-b border-white/[0.05]">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-violet-500/70 mb-3.5">How it works</p>
          <h2 className="text-[clamp(26px,4vw,40px)] font-bold tracking-tight text-white/88">Three steps to interview-ready</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] mt-12">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative px-8 py-7">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-[60px] bg-white/[0.06]" />
                )}
                <p className="font-mono text-[11px] font-medium text-violet-500/60 tracking-[0.08em] mb-3.5">{step.num}</p>
                <p className="text-[16px] font-semibold text-white/80 mb-2">{step.title}</p>
                <p className="text-[13px] text-white/30 leading-[1.7] font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── preview card ── */}
      <div className="py-20 px-6 max-w-[900px] mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-violet-500/70 mb-3.5">Live preview</p>
          <h2 className="text-[clamp(26px,4vw,40px)] font-bold tracking-tight text-white/88">What the session looks like</h2>
        </div>

        {/* mini session card */}
        <div className="relative bg-white/[0.025] border border-white/[0.07] rounded-[22px] p-9 overflow-hidden">
          <div className="absolute inset-[-1px] rounded-[22px] bg-gradient-to-br from-violet-500/12 via-transparent to-indigo-500/6 pointer-events-none" />
          <div className="relative">
            {/* header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <LivePulse size="sm" />
                <span className="text-xs font-semibold tracking-[0.1em] uppercase text-white/40 font-mono">AI Interview</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5 items-center">
                  {[0,1,2,3,4].map((i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
                      i < 2 ? "w-4 bg-violet-500" : i === 2 ? "w-4 bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" : "w-1.5 bg-white/10"
                    }`} />
                  ))}
                </div>
                <span className="text-xs text-white/25 font-mono tabular-nums">3/5</span>
              </div>
            </div>

            {/* timer */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] text-white/20 uppercase tracking-[0.08em]">Time Remaining</span>
                <span className="text-sm font-mono font-bold text-emerald-400 tabular-nums">28s</span>
              </div>
              <div className="h-[3px] w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full w-[60%] bg-emerald-400 rounded-full" />
              </div>
            </div>

            {/* question */}
            <div className="relative mb-6">
              <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-violet-500/20 via-transparent to-indigo-500/10" />
              <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
                <p className="text-[15px] leading-relaxed text-white/72 font-light">
                  Tell me about a time you had to make a difficult technical decision under time pressure. How did you approach it?
                </p>
              </div>
            </div>

            {/* buttons */}
            <div className="flex gap-2.5 flex-wrap">
              <button className="flex items-center gap-2 px-5 py-3 bg-violet-600 rounded-xl text-sm font-semibold text-white">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-1.5 14.9A6 6 0 0 1 6 10H4a8 8 0 0 0 7 7.938V20H8v2h8v-2h-3v-2.062A8 8 0 0 0 20 10h-2a6 6 0 0 1-4.5 5.9z" />
                </svg>
                Start Recording
              </button>
              <button className="flex items-center gap-2 px-5 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm font-medium text-white/50">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── roles ── */}
      <section className="py-20 px-6 max-w-[1100px] mx-auto">
        <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-violet-500/70 mb-3.5">Supported roles</p>
        <h2 className="text-[clamp(26px,4vw,40px)] font-bold tracking-tight text-white/88 mb-10">Practice for any track</h2>
        <div className="flex flex-wrap gap-2.5">
          {ROLES.map((role) => (
            <div
              key={role}
              className="flex items-center gap-2 px-[18px] py-2.5 bg-white/[0.03] hover:bg-violet-600/12 border border-white/[0.07] hover:border-violet-500/30 rounded-full text-[13px] text-white/45 hover:text-violet-300/85 transition-all duration-200 cursor-default"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-violet-600/60" />
              {role}
            </div>
          ))}
        </div>
      </section>

      {/* ── cta ── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-[640px] mx-auto bg-violet-600/6 border border-violet-500/20 rounded-[24px] px-10 py-14 relative overflow-hidden">
          <div className="absolute -top-[60px] left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full bg-violet-600/12 blur-[60px] pointer-events-none" />
          <h2 className="relative text-[clamp(24px,4vw,38px)] font-bold tracking-tight text-white/90 mb-4">Ready to practice?</h2>
          <p className="relative text-[15px] text-white/35 mb-9 font-light">Start your first session in under two minutes. No credit card required.</p>
          <button
            onClick={() => navigate("/login")}
            className="relative inline-flex items-center gap-2.5 px-8 py-4 bg-violet-600 hover:bg-violet-500 rounded-[14px] text-[16px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.55)] active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Begin Interview
          </button>
        </div>
      </section>

      {/* ── footer ── */}
      <footer className="px-10 py-7 border-t border-white/[0.05] flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(124,58,237,0.7)]" />
          <span className="text-xs text-white/20">MockIQ © 2025</span>
        </div>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <span key={l} className="text-xs text-white/20 hover:text-white/45 transition-colors cursor-pointer">{l}</span>
          ))}
        </div>
      </footer>

    </div>
  );
}