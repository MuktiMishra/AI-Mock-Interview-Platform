import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSessionAnswers, getSessionSummary } from "../api/session.api";

export default function Results() {
  const { sessionId } = useParams();
  const [summary, setSummary] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const [summaryRes, answersRes] = await Promise.all([
          getSessionSummary(sessionId),
          getSessionAnswers(sessionId),
        ]);

        setSummary(summaryRes.data.data);
        setAnswers(answersRes.data.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [sessionId]);

  if (loading) return <div style={{ padding: "24px" }}>Loading results...</div>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>Results</h1>

      {summary && (
        <div style={{ marginBottom: "24px" }}>
          <p>Domain: {summary.domain}</p>
          <p>Level: {summary.level}</p>
          <p>Status: {summary.status}</p>
          <p>Total Questions: {summary.totalQuestions}</p>
          <p>Answers Submitted: {summary.answersSubmitted}</p>
        </div>
      )}

      <h2>Answers</h2>

      {answers.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "8px",
          }}
        >
          <p><strong>Question:</strong> {item.questionId?.text}</p>
          <p><strong>Section:</strong> {item.questionId?.section}</p>

          {item.audio?.path && (
            <audio controls src={`http://localhost:5000/${item.audio.path}`} />
          )}
        </div>
      ))}
    </div>
  );
}