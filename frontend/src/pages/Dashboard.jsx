import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startSession } from "../api/session.api";

export default function Dashboard() {
  const [domain, setDomain] = useState("web-dev");
  const [level, setLevel] = useState("fresher");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = async () => {
    try {
      setLoading(true);
      const res = await startSession({ domain, level });
      const sessionId = res.data.data.sessionId;
      navigate(`/interview/${sessionId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to start session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Dashboard</h1>

      <div style={{ marginBottom: "12px" }}>
        <label>Domain</label>
        <br />
        <select value={domain} onChange={(e) => setDomain(e.target.value)}>
          <option value="web-dev">Web Dev</option>
        </select>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Level</label>
        <br />
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="fresher">Fresher</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <button onClick={handleStart} disabled={loading}>
        {loading ? "Starting..." : "Start Interview"}
      </button>
    </div>
  );
}