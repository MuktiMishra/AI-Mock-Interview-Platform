import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ReportPage() {
  const { id } = useParams();

  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/session/${id}/report`,
          { withCredentials: true }
        );

        console.log(res)

        setAnswers(res.data.data.answers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-600">
        Loading report...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          Interview Report
        </h1>

        {answers.map((ans, index) => (
          <div
            key={index}
            className="border border-purple-200 rounded-lg p-5 mb-4 bg-purple-50"
          >
            <h2 className="font-semibold text-purple-800 mb-2">
              Question {index + 1} {ans.questionId.text}
            </h2>

            <p className="text-gray-700 mb-2">
              <span className="font-medium">Transcript:</span> {ans.transcript}
            </p>

            <p className="text-gray-900 font-bold">
              Score: {ans.score || "0"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
