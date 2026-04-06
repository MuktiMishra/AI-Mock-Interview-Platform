import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { loadSettings } from "./Settings";

// ── Option labels ──────────────────────────────────────────────────────────
const OPTION_LETTERS = ["A", "B", "C", "D"];

function optionLetter(optionStr = "") {
  // Options come as "A. some text" — extract the letter prefix
  return optionStr.charAt(0).toUpperCase();
}

function optionText(optionStr = "") {
  // Strip the "A. " prefix for display
  return optionStr.replace(/^[A-D]\.\s*/i, "");
}

// ── Option button styles ───────────────────────────────────────────────────
function getOptionStyle(letter, selected, revealed, correctAnswer) {
  const isSelected = selected === letter;
  const isCorrect  = letter === correctAnswer;

  if (!revealed) {
    // Before submitting
    if (isSelected) return {
      background: "rgba(167,139,250,0.12)",
      border: "1px solid rgba(167,139,250,0.5)",
      color: "#a78bfa",
      transform: "scale(1.01)",
    };
    return {
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.08)",
      color: "rgba(255,255,255,0.55)",
    };
  }

  // After submitting — show correct / wrong
  if (isCorrect) return {
    background: "rgba(52,211,153,0.12)",
    border: "1px solid rgba(52,211,153,0.4)",
    color: "rgba(52,211,153,0.9)",
  };
  if (isSelected && !isCorrect) return {
    background: "rgba(248,113,113,0.1)",
    border: "1px solid rgba(248,113,113,0.35)",
    color: "rgba(248,113,113,0.8)",
  };
  return {
    background: "rgba(255,255,255,0.015)",
    border: "1px solid rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.25)",
  };
}

export default function InterviewSession() {
  const { id }         = useParams();
  const [searchParams] = useSearchParams();
  const driveId        = searchParams.get("driveId");
  const navigate       = useNavigate();
  const settings       = useRef(loadSettings()).current;

  // ── Shared state ──
  const [question, setQuestion]           = useState(null); // full question object
  const [currentIndex, setCurrentIndex]   = useState(0);
  const [total, setTotal]                 = useState(0);
  const [section, setSection]             = useState(null);
  const [loading, setLoading]             = useState(false);
  const [timeLeft, setTimeLeft]           = useState(40);

  // ── MCQ state (aptitude) ──
  const [selectedOption, setSelectedOption] = useState(null); // "A" | "B" | "C" | "D"
  const [revealed, setRevealed]             = useState(false);
  const [mcqScore, setMcqScore]             = useState(null);

  // ── Voice state (all other sections) ──
  const [recording, setRecording]   = useState(false);
  const [audioBlob, setAudioBlob]   = useState(null);
  const [lastScore, setLastScore]   = useState(null);
  const [showScore, setShowScore]   = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);
  const timerRef         = useRef(null);
  const warnedRef        = useRef(false);

  const isAptitude = section === "aptitude";

  // ── Load first question ────────────────────────────────────────────────
  const loadQuestion = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/session/${id}/current`, { withCredentials: true });
      const d   = res.data.data;
      setQuestion(d.question);
      setCurrentIndex(d.currentIndex);
      setTotal(d.totalQuestions);
      setSection(d.section || d.question?.section || null);
      setTimeLeft(40);
      warnedRef.current = false;
      resetAnswerState();
    } catch (err) { console.error(err); }
  };

  const resetAnswerState = () => {
    setSelectedOption(null);
    setRevealed(false);
    setMcqScore(null);
    setAudioBlob(null);
    setRecording(false);
    setLastScore(null);
    setShowScore(false);
  };

  useEffect(() => { loadQuestion(); }, []);

  // ── Timer ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (settings.warningSound && timeLeft === settings.timerRedAt && !warnedRef.current && !loading) {
      warnedRef.current = true; playBeep();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (loading || revealed) return;  // pause timer after MCQ reveal
    if (timeLeft <= 0) { handleAutoSubmit(); return; }
    timerRef.current = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, loading, revealed]);

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine"; osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
    } catch (_) {}
  };

  // ── Recording (voice rounds) ───────────────────────────────────────────
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = () => { setAudioBlob(new Blob(chunksRef.current, { type: "audio/webm" })); chunksRef.current = []; };
    recorder.start(); setRecording(true);
  };

  const stopRecording = () => { mediaRecorderRef.current?.stop(); setRecording(false); };

  const handleAutoSubmit = async () => {
    if (recording) stopRecording();
    await submitAnswer(true);
  };

  // ── MCQ option select ─────────────────────────────────────────────────
  const handleOptionSelect = (letter) => {
    if (revealed || loading) return;
    setSelectedOption(letter);
  };

  // ── MCQ confirm (reveal + submit) ─────────────────────────────────────
  const handleMCQConfirm = async () => {
    if (!selectedOption || revealed || loading) return;
    clearTimeout(timerRef.current);
    setRevealed(true);
    // Compute local score preview before backend confirms
    const isCorrect = selectedOption === question?.correctAnswer;
    setMcqScore(isCorrect ? 100 : 0);
    // Small delay so user sees the reveal, then submit
    setTimeout(() => submitAnswer(false), 1200);
  };

  // ── Notify drive round complete ────────────────────────────────────────
  const notifyDriveRoundComplete = async () => {
    if (!driveId) return;
    try {
      await axios.post(`http://localhost:8000/drive/${driveId}/complete-round`, { sessionId: id }, { withCredentials: true });
    } catch (err) { console.error("Drive notify failed:", err); }
  };

  // ── Submit answer ──────────────────────────────────────────────────────
  const submitAnswer = async (isAuto = false) => {
    if (!isAptitude && !audioBlob && !isAuto) return;

    const formData = new FormData();
    formData.append("question", question?.text || "");

    if (isAptitude) {
      formData.append("selectedOption", selectedOption || "");
    } else {
      if (!isAuto && audioBlob) formData.append("audio", audioBlob);
    }

    try {
      setLoading(true);
      clearTimeout(timerRef.current);

      const res = await axios.post(`http://localhost:8000/session/${id}/answer`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data.data;

      if (data.completed) {
        await notifyDriveRoundComplete();
        navigate(driveId ? `/drive/${driveId}` : `/report/${id}`);
        return;
      }

      // Show score flash for voice rounds
      if (!isAptitude && settings.showScoreOnSubmit && data.score !== undefined) {
        setLastScore(data.score); setShowScore(true);
        setTimeout(() => setShowScore(false), 2000);
      }

      // Advance to next question
      setQuestion(data.question);
      setCurrentIndex(data.currentIndex);
      setSection(data.section || data.question?.section || section);
      setTimeLeft(40);
      warnedRef.current = false;
      resetAnswerState();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Timer colours ──────────────────────────────────────────────────────
  const timerPercent  = (timeLeft / 40) * 100;
  const timerColor    = timeLeft > settings.timerAmberAt ? "#34d399" : timeLeft > settings.timerRedAt ? "#fbbf24" : "#f87171";
  const timerBarColor = timeLeft > settings.timerAmberAt ? "bg-emerald-400" : timeLeft > settings.timerRedAt ? "bg-amber-400" : "bg-red-500";

  // ── Section pill meta ──────────────────────────────────────────────────
  const SECTION_META = {
    aptitude:   { label: "Aptitude · MCQ",            color: "#a78bfa", bg: "rgba(167,139,250,0.1)",  border: "rgba(167,139,250,0.25)" },
    technical1: { label: "Technical I",               color: "#60a5fa", bg: "rgba(96,165,250,0.1)",   border: "rgba(96,165,250,0.25)"  },
    technical2: { label: "Technical II · Resume",     color: "#34d399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.25)"  },
    hr:         { label: "HR Round",                  color: "#f472b6", bg: "rgba(244,114,182,0.1)",  border: "rgba(244,114,182,0.25)" },
    coding:     { label: "Coding",                    color: "#f59e0b", bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.25)"  },
  };
  const sectionMeta = SECTION_META[section] || SECTION_META.technical1;

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      <style>{`
        @keyframes fadeIn  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes correct { 0% { transform:scale(1); } 50% { transform:scale(1.03); } 100% { transform:scale(1); } }
      `}</style>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-[120px]" />
      </div>

      <div className="w-full relative" style={{ maxWidth: isAptitude ? 580 : 640 }}>
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 shadow-2xl backdrop-blur-sm">

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500" />
              </span>
              <span className="text-xs font-semibold tracking-widest uppercase text-white/40">AI Interview</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 items-center">
                {Array.from({ length: total }).map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
                    i < currentIndex ? "w-4 bg-violet-500"
                    : i === currentIndex ? "w-4 bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]"
                    : "w-1.5 bg-white/10"
                  }`} />
                ))}
              </div>
              <span className="text-xs text-white/30 font-mono tabular-nums">{currentIndex + 1}/{total}</span>
            </div>
          </div>

          {/* ── Section pill ── */}
          {section && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8, marginBottom: 20, background: sectionMeta.bg, border: `1px solid ${sectionMeta.border}` }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: sectionMeta.color, display: "inline-block" }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: sectionMeta.color }}>{sectionMeta.label}</span>
              {driveId && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginLeft: 2 }}>· Campus Drive</span>}
            </div>
          )}

          {/* ── Timer ── */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-white/25 uppercase tracking-widest font-medium">Time Remaining</span>
              <span className="text-sm font-mono font-bold tabular-nums" style={{ color: timerColor }}>
                {String(timeLeft).padStart(2, "0")}s
              </span>
            </div>
            <div className="h-[3px] w-full bg-white/[0.06] rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ease-linear ${timerBarColor}`} style={{ width: `${timerPercent}%` }} />
            </div>
          </div>

          {/* ── Question box ── */}
          <div className="relative mb-6">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-violet-500/20 via-transparent to-indigo-500/10" />
            <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 min-h-[90px] flex items-center">
              {question ? (
                <p className="text-[15px] leading-relaxed text-white/75 font-light">{question.text}</p>
              ) : (
                <div className="flex gap-1.5">
                  {[0,150,300].map((d) => <span key={d} className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                </div>
              )}
            </div>
          </div>

          {/* ════════════════════════════════════════════════
              MCQ UI — Aptitude section
          ════════════════════════════════════════════════ */}
          {isAptitude && question?.options?.length > 0 && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              {/* Options grid */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {question.options.map((opt, i) => {
                  const letter = OPTION_LETTERS[i];
                  const style  = getOptionStyle(letter, selectedOption, revealed, question.correctAnswer);
                  const isCorrectRevealed = revealed && letter === question.correctAnswer;
                  const isWrongSelected   = revealed && letter === selectedOption && letter !== question.correctAnswer;

                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(letter)}
                      disabled={revealed || loading}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "14px 16px", borderRadius: 14, cursor: revealed || loading ? "default" : "pointer",
                        fontFamily: "inherit", textAlign: "left", width: "100%",
                        transition: "all 0.2s",
                        animation: isCorrectRevealed ? "correct 0.4s ease" : "none",
                        ...style,
                      }}
                    >
                      {/* Letter bubble */}
                      <div style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700,
                        background: isCorrectRevealed ? "rgba(52,211,153,0.2)"
                          : isWrongSelected ? "rgba(248,113,113,0.15)"
                          : selectedOption === letter && !revealed ? "rgba(167,139,250,0.2)"
                          : "rgba(255,255,255,0.05)",
                        color: style.color,
                        border: `1px solid ${isCorrectRevealed ? "rgba(52,211,153,0.3)" : isWrongSelected ? "rgba(248,113,113,0.25)" : selectedOption === letter && !revealed ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.08)"}`,
                        transition: "all 0.2s",
                      }}>
                        {isCorrectRevealed ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : isWrongSelected ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                          </svg>
                        ) : letter}
                      </div>

                      <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.5, flex: 1 }}>
                        {optionText(opt)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* MCQ result flash */}
              {revealed && mcqScore !== null && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", borderRadius: 12, marginBottom: 16,
                  background: mcqScore === 100 ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)",
                  border: `1px solid ${mcqScore === 100 ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.25)"}`,
                  animation: "fadeIn 0.2s ease",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: mcqScore === 100 ? "#34d399" : "#f87171", display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: mcqScore === 100 ? "rgba(52,211,153,0.9)" : "rgba(248,113,113,0.85)" }}>
                    {mcqScore === 100 ? "Correct! Well done." : `Incorrect — the correct answer was ${question.correctAnswer}.`}
                  </span>
                </div>
              )}

              {/* Confirm button — only before reveal */}
              {!revealed && (
                <button
                  onClick={handleMCQConfirm}
                  disabled={!selectedOption || loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98]"
                  style={{
                    background: selectedOption ? "#7c3aed" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${selectedOption ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)"}`,
                    color: selectedOption ? "white" : "rgba(255,255,255,0.2)",
                    cursor: selectedOption ? "pointer" : "not-allowed",
                    fontFamily: "inherit",
                    boxShadow: selectedOption ? "0 0 16px rgba(124,58,237,0.3)" : "none",
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Confirm Answer
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════
              VOICE UI — All other sections
          ════════════════════════════════════════════════ */}
          {!isAptitude && (
            <>
              {/* Score flash */}
              {showScore && lastScore !== null && (
                <div className={`flex items-center gap-2 mb-5 px-4 py-2.5 rounded-xl border ${lastScore >= 80 ? "bg-emerald-500/10 border-emerald-500/20" : lastScore >= 70 ? "bg-amber-400/10 border-amber-400/20" : "bg-red-500/10 border-red-500/20"}`}>
                  <div className={`w-2 h-2 rounded-full ${lastScore >= 80 ? "bg-emerald-400" : lastScore >= 70 ? "bg-amber-400" : "bg-red-400"}`} />
                  <span className={`text-xs font-semibold ${lastScore >= 80 ? "text-emerald-400" : lastScore >= 70 ? "text-amber-400" : "text-red-400"}`}>
                    Score: {lastScore}/100 — {lastScore >= 80 ? "Excellent" : lastScore >= 70 ? "Good" : lastScore >= 40 ? "Average" : "Keep practising"}
                  </span>
                </div>
              )}

              {/* Waveform */}
              {recording && (
                <div className="flex items-center justify-center gap-[3px] mb-6 h-10 px-4 bg-red-500/5 border border-red-500/15 rounded-xl">
                  <span className="text-xs text-red-400/70 font-medium mr-3">Recording</span>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="w-[3px] rounded-full bg-red-400 animate-pulse"
                      style={{ height: `${8 + ((i * 7 + 3) % 20)}px`, animationDelay: `${i * 50}ms`, animationDuration: `${700 + (i % 3) * 200}ms` }} />
                  ))}
                </div>
              )}

              {/* Audio ready */}
              {audioBlob && !recording && (
                <div className="flex items-center gap-2 mb-6 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  <span className="text-xs text-emerald-400 font-medium">Recording captured — ready to submit</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                {!recording ? (
                  <button onClick={startRecording} disabled={loading}
                    className="flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(124,58,237,0.35)] active:scale-[0.98]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-1.5 14.9A6.002 6.002 0 0 1 6 10H4a8.001 8.001 0 0 0 7 7.938V20H8v2h8v-2h-3v-2.062A8.001 8.001 0 0 0 20 10h-2a6 6 0 0 1-4.5 5.9z" />
                    </svg>
                    Start Recording
                  </button>
                ) : (
                  <button onClick={stopRecording}
                    className="flex items-center gap-2 px-5 py-3 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.98]">
                    <span className="w-3 h-3 rounded-sm bg-red-400" /> Stop Recording
                  </button>
                )}
                <button onClick={() => submitAnswer(false)} disabled={!audioBlob || loading}
                  className="flex items-center gap-2 px-5 py-3 bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-25 disabled:cursor-not-allowed border border-white/[0.08] hover:border-white/[0.15] text-white/60 hover:text-white/90 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.98]">
                  {loading ? (
                    <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" /></svg>Processing…</>
                  ) : (
                    <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" /></svg>Submit Answer</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-[11px] text-white/20 mt-4 tracking-wide">
          {isAptitude
            ? "Select an option and confirm — timer auto-submits on timeout"
            : driveId ? "Completing this round returns you to the Drive Hub" : "Answer auto-submits when the timer reaches zero"}
        </p>
      </div>
    </div>
  );
}