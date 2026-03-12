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
        {
          domain,
          level,
        },
        { withCredentials: true }
      );

      console.log(res)

      const sessionId = res.data.data.sessionId;

      navigate(`/interview/${sessionId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white shadow-xl border rounded-xl p-10 w-[420px]">

        <h1 className="text-2xl font-bold text-purple-700 mb-6">
          Start Mock Interview
        </h1>

        {/* DOMAIN */}
        <label className="block mb-2 font-medium">Domain</label>

        <select
          className="w-full border p-3 rounded mb-5"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        >
          <option value="web-dev">web-dev</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
        </select>

        {/* LEVEL */}
        <label className="block mb-2 font-medium">Level</label>

        <select
          className="w-full border p-3 rounded mb-6"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="fresher">Fresher</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <button
          onClick={startInterview}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition"
        >
          {loading ? "Starting..." : "Start Interview"}
        </button>

      </div>
    </div>
  );
}

export default StartInterview; 