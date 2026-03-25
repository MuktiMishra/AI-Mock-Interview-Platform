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

  // LOAD QUESTION
  const loadQuestion = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/session/${id}/current`,
        { withCredentials: true },
      );

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

  // TIMER
  useEffect(() => {
    // ❌ Don't run timer if loading (API in progress)
    if (loading) return;

    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, loading]);

  // START RECORDING
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      chunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioBlob(blob);
      chunksRef.current = [];
    };

    recorder.start();
    setRecording(true);
  };

  // STOP RECORDING
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  // AUTO SUBMIT (EMPTY ANSWER)
  const handleAutoSubmit = async () => {
    if (recording) stopRecording();
    await submitAnswer(true);
  };

  // SUBMIT ANSWER
  const submitAnswer = async (isAuto = false) => {
    if (!audioBlob && !isAuto) return;

    const formData = new FormData();
    formData.append("question", question);

    if (!isAuto && audioBlob) {
      formData.append("audio", audioBlob);
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:8000/session/${id}/answer`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-[700px] bg-white shadow-xl rounded-xl border p-10">
        <div className="flex justify-between mb-6">
          <h2 className="text-purple-700 font-semibold text-lg">
            AI Interview
          </h2>

          <span className="text-gray-500">
            Question {currentIndex + 1} / {total}
          </span>
        </div>

        {/* TIMER */}
        <div className="mb-4 text-right text-purple-600 font-semibold">
          Time Left: {timeLeft}s
        </div>

        {/* QUESTION */}
        <div className="bg-purple-50 border border-purple-200 p-6 rounded mb-8">
          <p className="text-lg font-medium text-gray-800">{question}</p>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4">
          {!recording ? (
            <button
              onClick={startRecording}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-500 text-white px-6 py-3 rounded"
            >
              Stop Recording
            </button>
          )}

          <button
            onClick={() => submitAnswer(false)}
            disabled={!audioBlob || loading}
            className="bg-green-500 text-white px-6 py-3 rounded disabled:opacity-50"
          >
            Submit Answer
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="mt-6 text-center text-purple-600 font-medium">
            Processing your answer...
          </div>
        )}
      </div>
    </div>
  );
}
