import { useNavigate } from "react-router";


export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="w-full border-b border-purple-100 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
          <h1 className="text-2xl font-bold text-purple-700">AI Mock Interview</h1>
          <button
            onClick={() => navigate("/start")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Start Interview
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
              Practice Interviews with
              <span className="text-purple-600"> AI</span>
            </h2>

            <p className="text-gray-600 mb-8">
              Simulate real technical interviews, record your answers, and
              improve your communication and technical explanation skills.
            </p>

            <button
              onClick={() => navigate("/start")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow"
            >
              Start Mock Interview
            </button>
          </div>

          {/* Feature Card */}
          <div className="bg-white border border-purple-100 shadow-lg rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-purple-700 mb-6">
              Interview Features
            </h3>

            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full mt-2" />
                <p>Realistic interview questions</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full mt-2" />
                <p>Audio answer recording</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full mt-2" />
                <p>Multiple interview difficulty levels</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full mt-2" />
                <p>Track your interview sessions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white border border-purple-100 rounded-xl p-6 shadow-sm">
            <h4 className="text-sm text-gray-500">Practice Domains</h4>
            <p className="text-3xl font-bold text-purple-700 mt-2">10+</p>
          </div>

          <div className="bg-white border border-purple-100 rounded-xl p-6 shadow-sm">
            <h4 className="text-sm text-gray-500">Interview Questions</h4>
            <p className="text-3xl font-bold text-purple-700 mt-2">100+</p>
          </div>

          <div className="bg-white border border-purple-100 rounded-xl p-6 shadow-sm">
            <h4 className="text-sm text-gray-500">Interview Sessions</h4>
            <p className="text-3xl font-bold text-purple-700 mt-2">∞</p>
          </div>
        </div>
      </div>
    </div>
  );
}

