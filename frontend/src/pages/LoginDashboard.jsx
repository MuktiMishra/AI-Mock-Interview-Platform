import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginDashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [domain, setDomain] = useState("mern");
  const [level, setLevel] = useState("fresher");

  const navigate = useNavigate();

  // LOAD SESSIONS
  const fetchSessions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/session/sessions",
        { withCredentials: true }
      );

      setSessions(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // START INTERVIEW
  const startInterview = async () => {
    try {
      navigate(`/start`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          Dashboard
        </h1>

        {/* START INTERVIEW CARD */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
          

          <button
            onClick={startInterview}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            Start Interview
          </button>
        </div>

        {/* PREVIOUS REPORTS */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Previous Interviews
          </h2>

          {loading ? (
            <p className="text-purple-600">Loading...</p>
          ) : sessions.length === 0 ? (
            <p className="text-gray-500">No interviews yet</p>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session._id}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {session.domain.toUpperCase()} - {session.level}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {session.status}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/report/${session._id}`)}
                    className="text-purple-600 hover:underline"
                  >
                    View Report
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}