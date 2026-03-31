import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function InterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [total, setTotal] = useState(0);

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const [timeLeft, setTimeLeft] = useState(40);
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const loadQuestion = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/session/${id}/current`, {
        withCredentials: true,
      });
      setQuestion(res.data.data.question.text);
      setCurrentIndex(res.data.data.currentIndex);
      setTotal(res.data.data.totalQuestions);
      setTimeLeft(40);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, loading]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = () => {
      setAudioBlob(new Blob(chunksRef.current, { type: "audio/webm" }));
      chunksRef.current = [];
    };
    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleAutoSubmit = async () => {
    if (recording) stopRecording();
    await submitAnswer(true);
  };

  const submitAnswer = async (isAuto = false) => {
    if (!audioBlob && !isAuto) return;
    const formData = new FormData();
    formData.append("question", question);
    if (!isAuto && audioBlob) formData.append("audio", audioBlob);
    try {
      setLoading(true);
      const res = await axios.post(`http://localhost:8000/session/${id}/answer`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.data.completed) {
        navigate(`/report/${id}`);
        return;
      }
      setQuestion(res.data.data.question.text);
      setCurrentIndex(res.data.data.currentIndex);
      setAudioBlob(null);
      setTimeLeft(40);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const timerPercent = (timeLeft / 40) * 100;
  const timerColor =
    timeLeft > 20 ? "text-emerald-400" : timeLeft > 10 ? "text-amber-400" : "text-red-400";
  const timerBarColor =
    timeLeft > 20 ? "bg-emerald-400" : timeLeft > 10 ? "bg-amber-400" : "bg-red-500";

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl relative">
        {/* Main card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 shadow-2xl backdrop-blur-sm">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500" />
              </span>
              <span className="text-xs font-semibold tracking-widest uppercase text-white/40">
                AI Interview
              </span>
            </div>

            {/* Progress dots + counter */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 items-center">
                {Array.from({ length: total }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i < currentIndex
                        ? "w-4 bg-violet-500"
                        : i === currentIndex
                        ? "w-4 bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]"
                        : "w-1.5 bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-white/30 font-mono tabular-nums">
                {currentIndex + 1}/{total}
              </span>
            </div>
          </div>

          {/* Timer */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-white/25 uppercase tracking-widest font-medium">
                Time Remaining
              </span>
              <span className={`text-sm font-mono font-bold tabular-nums ${timerColor}`}>
                {String(timeLeft).padStart(2, "0")}s
              </span>
            </div>
            <div className="h-[3px] w-full bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${timerBarColor}`}
                style={{ width: `${timerPercent}%` }}
              />
            </div>
          </div>

          {/* Question box */}
          <div className="relative mb-7">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-violet-500/20 via-transparent to-indigo-500/10" />
            <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 min-h-[100px] flex items-center">
              {question ? (
                <p className="text-[15px] leading-relaxed text-white/75 font-light">
                  {question}
                </p>
              ) : (
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
            </div>
          </div>

          {/* Recording waveform */}
          {recording && (
            <div className="flex items-center justify-center gap-[3px] mb-6 h-10 px-4 bg-red-500/5 border border-red-500/15 rounded-xl">
              <span className="text-xs text-red-400/70 font-medium mr-3">Recording</span>
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-red-400 animate-pulse"
                  style={{
                    height: `${8 + ((i * 7 + 3) % 20)}px`,
                    animationDelay: `${i * 50}ms`,
                    animationDuration: `${700 + (i % 3) * 200}ms`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Audio ready badge */}
          {audioBlob && !recording && (
            <div className="flex items-center gap-2 mb-6 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="text-xs text-emerald-400 font-medium">Recording captured — ready to submit</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            {!recording ? (
              <button
                onClick={startRecording}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(124,58,237,0.35)] active:scale-[0.98]"
              >
                {/* Mic icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-1.5 14.9A6.002 6.002 0 0 1 6 10H4a8.001 8.001 0 0 0 7 7.938V20H8v2h8v-2h-3v-2.062A8.001 8.001 0 0 0 20 10h-2a6 6 0 0 1-4.5 5.9z" />
                </svg>
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-5 py-3 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                <span className="w-3 h-3 rounded-sm bg-red-400" />
                Stop Recording
              </button>
            )}

            <button
              onClick={() => submitAnswer(false)}
              disabled={!audioBlob || loading}
              className="flex items-center gap-2 px-5 py-3 bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-25 disabled:cursor-not-allowed border border-white/[0.08] hover:border-white/[0.15] text-white/60 hover:text-white/90 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                  </svg>
                  Processing…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Submit Answer
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-[11px] text-white/20 mt-4 tracking-wide">
          Answer auto-submits when the timer reaches zero
        </p>
      </div>
    </div>
  );
}