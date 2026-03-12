import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentQuestion, submitAnswer } from "../api/session.api";

export default function Interview() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [questionData, setQuestionData] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchCurrent = async () => {
    try {
      setLoading(true);
      const res = await getCurrentQuestion(sessionId);
      if (res.data.data.completed) {
        navigate(`/results/${sessionId}`);
        return;
      }
      setQuestionData(res.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load question");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrent();
  }, [sessionId]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      if (audioFile) {
        formData.append("audio", audioFile);
      }

      const res = await submitAnswer(sessionId, formData);

      if (res.data.data.completed) {
        navigate(`/results/${sessionId}`);
        return;
      }

      setQuestionData(res.data.data);
      setAudioFile(null);
    } catch (error) {
      console.error(error);
      alert("Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: "24px" }}>Loading...</div>;
  if (!questionData) return <div style={{ padding: "24px" }}>No question found</div>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>Interview Room</h1>
      <p>
        Question {questionData.currentIndex + 1} / {questionData.totalQuestions}
      </p>

      <div style={{ marginBottom: "16px" }}>
        <strong>{questionData.question.section}</strong>
        <p>{questionData.question.text}</p>
      </div>

      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudioFile(e.target.files[0])}
      />

      <div style={{ marginTop: "16px" }}>
        <button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Answer"}
        </button>
      </div>
    </div>
  );
}