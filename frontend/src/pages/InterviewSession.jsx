import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function InterviewSession() {

  const { id } = useParams();
  const navigate = useNavigate(); 

  const [question, setQuestion] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [total, setTotal] = useState(0);

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // LOAD QUESTION
  const loadQuestion = async () => {
    try {

      const res = await axios.get(
        `http://localhost:8000/session/${id}/current`,
        { withCredentials: true }
      );

      console.log("Question", res)

      setQuestion(res.data.data.question.text);
      setCurrentIndex(res.data.data.currentIndex);
      setTotal(res.data.data.totalQuestions);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, []);

  // START RECORDING
  const startRecording = async () => {

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const recorder = new MediaRecorder(stream);

    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      chunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: "audio/webm",
      });

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

  // SUBMIT ANSWER
  const submitAnswer = async () => {

    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('question', question); 
    formData.append("audio", audioBlob);

    try {

      const res = await axios.post(
        `http://localhost:8000/session/${id}/answer`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.data.completed) {
        navigate(`/report/${id}`);
        return;
      }

      setQuestion(res.data.data.question.text);
      setCurrentIndex(res.data.data.currentIndex);
      setAudioBlob(null);

    } catch (err) {
      console.error(err);
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

        {/* QUESTION */}
        <div className="bg-purple-50 border border-purple-200 p-6 rounded mb-8">

          <p className="text-lg font-medium text-gray-800">
            {question}
          </p>

        </div>

        {/* RECORD BUTTON */}
        <div className="flex gap-4">

          {!recording ? (
            <button
              onClick={startRecording}
              className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700"
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
            onClick={submitAnswer}
            disabled={!audioBlob}
            className="bg-green-500 text-white px-6 py-3 rounded disabled:opacity-50"
          >
            Submit Answer
          </button>

        </div>

      </div>
    </div>
  );
}