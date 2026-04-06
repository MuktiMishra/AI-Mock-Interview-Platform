import { useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function Icon({ name, size = 16 }) {
  const s = { width: size, height: size, flexShrink: 0 };
  if (name === "upload") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
    </svg>
  );
  if (name === "file") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (name === "check") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (name === "x") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
  if (name === "back") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (name === "code") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
  if (name === "sparkle") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 17l.75 2.25L22 20l-2.25.75L19 23l-.75-2.25L16 20l2.25-.75L19 17z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return null;
}

function LivePulse() {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
      <span style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: "rgba(52,211,153,0.75)", animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
      <span style={{ position: "relative", width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
    </span>
  );
}

const ResumeUpload = () => {
  const { driveId }    = useParams();
  const [searchParams] = useSearchParams();
  const sessionId      = searchParams.get("sessionId");
  const navigate       = useNavigate();

  const [file, setFile]           = useState(null);
  const [dragOver, setDragOver]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded]   = useState(false);
  const [error, setError]         = useState(null);
  const [parseInfo, setParseInfo] = useState(null); // { resumeFileName, resumeLength }
  const fileInputRef              = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }
    setError(null);
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append("resume", file);
      const res = await axios.post(
        `http://localhost:8000/drive/${driveId}/resume`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      setParseInfo(res.data.data);
      setUploaded(true);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleBegin = () => {
    navigate(`/interview/${sessionId}?driveId=${driveId}`);
  };

  const handleSkip = () => {
    navigate(`/interview/${sessionId}?driveId=${driveId}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", fontFamily: "'Sora', 'Inter', sans-serif", color: "white", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap');
        @keyframes ping     { 75%,100% { transform:scale(2); opacity:0; } }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer  { 0% { opacity:0.4; } 50% { opacity:0.9; } 100% { opacity:0.4; } }
        * { box-sizing:border-box; margin:0; padding:0; }
        .drop-zone:hover { border-color: rgba(52,211,153,0.4) !important; background: rgba(52,211,153,0.04) !important; }
        .back-btn:hover  { color: rgba(255,255,255,0.6) !important; }
        .skip-btn:hover  { color: rgba(255,255,255,0.4) !important; }
      `}</style>

      {/* Background glows */}
      <div style={{ pointerEvents: "none", position: "fixed", inset: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -160, left: -160, width: 500, height: 500, borderRadius: "50%", background: "rgba(16,185,129,0.07)", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", bottom: -160, right: -160, width: 420, height: 420, borderRadius: "50%", background: "rgba(109,40,217,0.06)", filter: "blur(100px)" }} />
      </div>

      <div style={{ width: "100%", maxWidth: 500, position: "relative", animation: "fadeUp 0.4s ease" }}>
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "36px 36px 32px", backdropFilter: "blur(16px)" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <LivePulse />
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Technical II · Resume Round</span>
            </div>
            <button className="back-btn" onClick={() => navigate(`/drive/${driveId}`)}
              style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.2)", fontSize: 11, fontFamily: "inherit", transition: "color 0.2s", padding: 0 }}>
              <Icon name="back" size={12} /> Back
            </button>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399" }}>
                <Icon name="code" size={16} />
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.02em" }}>
                Resume-Based Interview
              </h1>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}>
              Upload your resume and our AI will generate 10 questions tailored specifically to your experience, projects, and skills.
            </p>
          </div>

          {/* What AI does with it */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {[
              "Questions reference your specific projects and tech stack",
              "Probes depth on skills you've claimed",
              "Asks about real roles and responsibilities you've listed",
            ].map((point, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, color: "#34d399" }}>
                  <Icon name="check" size={9} />
                </div>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>{point}</span>
              </div>
            ))}
          </div>

          {/* Upload area — only show if not yet uploaded */}
          {!uploaded ? (
            <>
              {/* Drop zone */}
              <div
                className="drop-zone"
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? "rgba(52,211,153,0.5)" : file ? "rgba(52,211,153,0.35)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 16, padding: "28px 20px", textAlign: "center",
                  cursor: "pointer", transition: "all 0.2s", marginBottom: 16,
                  background: dragOver ? "rgba(52,211,153,0.05)" : file ? "rgba(52,211,153,0.03)" : "rgba(255,255,255,0.01)",
                }}
              >
                <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files[0])} />

                {file ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399" }}>
                      <Icon name="file" size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)", marginBottom: 3 }}>{file.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{(file.size / 1024).toFixed(0)} KB · PDF</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 6, fontSize: 11, color: "rgba(248,113,113,0.7)", cursor: "pointer", fontFamily: "inherit" }}>
                      <Icon name="x" size={10} /> Remove
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)" }}>
                      <Icon name="upload" size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>Drop your resume here</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>or click to browse · PDF only · max 5MB</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10, marginBottom: 14, fontSize: 12, color: "rgba(248,113,113,0.8)" }}>
                  <Icon name="x" size={13} /> {error}
                </div>
              )}

              {/* Upload button */}
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "13px", borderRadius: 14, border: "none", fontFamily: "inherit",
                  fontSize: 13, fontWeight: 700, cursor: file && !uploading ? "pointer" : "not-allowed",
                  background: file && !uploading ? "#10b981" : "rgba(255,255,255,0.05)",
                  color: file && !uploading ? "white" : "rgba(255,255,255,0.2)",
                  transition: "all 0.2s", marginBottom: 12,
                  boxShadow: file && !uploading ? "0 0 20px rgba(16,185,129,0.3)" : "none",
                }}
              >
                {uploading ? (
                  <>
                    <svg style={{ width: 15, height: 15, animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                    </svg>
                    Parsing Resume…
                  </>
                ) : (
                  <><Icon name="sparkle" size={14} />Upload & Parse Resume</>
                )}
              </button>

              {/* Skip */}
              <button className="skip-btn" onClick={handleSkip}
                style={{ width: "100%", padding: "10px", background: "none", border: "none", fontSize: 12, color: "rgba(255,255,255,0.2)", cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s" }}>
                Skip — use generic questions instead
              </button>
            </>
          ) : (
            /* ── Uploaded success state ── */
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <div style={{ padding: "20px", background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 14, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399" }}>
                    <Icon name="check" size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(52,211,153,0.9)" }}>Resume Parsed Successfully</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{parseInfo?.resumeFileName}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.2)", marginBottom: 4 }}>Characters</div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>{parseInfo?.resumeLength?.toLocaleString()}</div>
                  </div>
                  <div style={{ flex: 1, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.2)", marginBottom: 4 }}>Questions</div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>10 tailored</div>
                  </div>
                </div>
              </div>

              <button onClick={handleBegin}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: 14, border: "none", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer", background: "#7c3aed", color: "white", transition: "all 0.2s", boxShadow: "0 0 24px rgba(124,58,237,0.35)" }}>
                <svg style={{ width: 15, height: 15 }} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>
                Begin Technical II Interview
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.15)", marginTop: 16 }}>
          Your resume is only used to generate questions — it is not stored beyond this session
        </p>
      </div>

      <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
    </div>
  );
};

export default ResumeUpload;