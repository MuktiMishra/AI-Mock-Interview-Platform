// import { useNavigate } from "react-router";


// export default function Dashboard() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Top Bar */}
//       <div className="w-full border-b border-purple-100 bg-white">
//         <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
//           <h1 className="text-2xl font-bold text-purple-700">AI Mock Interview</h1>
//           <button
//             onClick={() => navigate("/start")}
//             className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
//           >
//             Start Interview
//           </button>
//         </div>
//       </div>

//       {/* Hero Section */}
//       <div className="max-w-6xl mx-auto px-6 py-12">
//         <div className="grid md:grid-cols-2 gap-10 items-center">
//           <div>
//             <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
//               Practice Interviews with
//               <span className="text-purple-600"> AI</span>
//             </h2>

//             <p className="text-gray-600 mb-8">
//               Simulate real technical interviews, record your answers, and
//               improve your communication and technical explanation skills.
//             </p>

//             <button
//               onClick={() => navigate("/start")}
//               className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow"
//             >
//               Start Mock Interview
//             </button>
//           </div>

//           {/* Feature Card */}
//           <div className="bg-white border border-purple-100 shadow-lg rounded-2xl p-8">
//             <h3 className="text-lg font-semibold text-purple-700 mb-6">
//               Interview Features
//             </h3>

//             <div className="space-y-4 text-gray-700">
//               <div className="flex items-start gap-3">
//                 <div className="w-3 h-3 bg-purple-500 rounded-full mt-2" />
//                 <p>Realistic interview questions</p>
//               </div>

//               <div className="flex items-start gap-3">
//                 <div className="w-3 h-3 bg-purple-500 rounded-full mt-2" />
//                 <p>Audio answer recording</p>
//               </div>

//               <div className="flex items-start gap-3">
//                 <div className="w-3 h-3 bg-purple-500 rounded-full mt-2" />
//                 <p>Multiple interview difficulty levels</p>
//               </div>

//               <div className="flex items-start gap-3">
//                 <div className="w-3 h-3 bg-purple-500 rounded-full mt-2" />
//                 <p>Track your interview sessions</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats Section */}
//         <div className="grid md:grid-cols-3 gap-6 mt-16">
//           <div className="bg-white border border-purple-100 rounded-xl p-6 shadow-sm">
//             <h4 className="text-sm text-gray-500">Practice Domains</h4>
//             <p className="text-3xl font-bold text-purple-700 mt-2">10+</p>
//           </div>

//           <div className="bg-white border border-purple-100 rounded-xl p-6 shadow-sm">
//             <h4 className="text-sm text-gray-500">Interview Questions</h4>
//             <p className="text-3xl font-bold text-purple-700 mt-2">100+</p>
//           </div>

//           <div className="bg-white border border-purple-100 rounded-xl p-6 shadow-sm">
//             <h4 className="text-sm text-gray-500">Interview Sessions</h4>
//             <p className="text-3xl font-bold text-purple-700 mt-2">∞</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();

  const domains = [
    "Software Engineering",
    "Data Science",
    "Machine Learning",
    "Web Development",
    "System Design",
    "Data Design",
    "Coding",
    "HR Round",
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <div className="w-full bg-white border-b">
        <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-xl font-bold text-purple-700">
            MockPrep.ai
          </h1>

          <div className="flex gap-6 items-center">
            <button className="text-gray-600 hover:text-purple-600">
              Features
            </button>

            <button className="text-gray-600 hover:text-purple-600">
              Pricing
            </button>

            <button
              onClick={() => navigate("/start")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-semibold"
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

        <div>
          <h2 className="text-5xl font-bold text-gray-900 leading-tight">
            Practice Interviews with AI —
            <span className="text-purple-600"> Get Better Faster</span>
          </h2>

          <p className="text-gray-600 mt-6">
            Timed interview rounds, audio recording and AI feedback
            to improve your interview performance.
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate("/start")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Start Free Mock Interview
            </button>

            <button className="border border-gray-300 px-6 py-3 rounded-lg font-semibold">
              Explore Domains
            </button>
          </div>
        </div>

        {/* Illustration */}
        <div className="bg-white rounded-2xl shadow-lg border p-10 flex justify-center items-center">
          <div className="text-center">
            <div className="text-6xl">🤖</div>
            <p className="text-gray-600 mt-4">
              AI Powered Interview Practice
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">

          <h3 className="text-3xl font-bold text-center mb-12">
            How it works
          </h3>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="text-center">
              <div className="text-purple-600 text-3xl mb-4">1️⃣</div>
              <h4 className="font-semibold mb-2">
                Select Domain & Level
              </h4>
              <p className="text-gray-600 text-sm">
                Choose the domain and difficulty level you want
                to practice.
              </p>
            </div>

            <div className="text-center">
              <div className="text-purple-600 text-3xl mb-4">2️⃣</div>
              <h4 className="font-semibold mb-2">
                Answer Interview Questions
              </h4>
              <p className="text-gray-600 text-sm">
                Record answers to simulated interview questions.
              </p>
            </div>

            <div className="text-center">
              <div className="text-purple-600 text-3xl mb-4">3️⃣</div>
              <h4 className="font-semibold mb-2">
                Get AI Feedback
              </h4>
              <p className="text-gray-600 text-sm">
                Receive insights and feedback to improve.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Supported Domains */}
      <div className="max-w-6xl mx-auto px-6 py-16">

        <h3 className="text-3xl font-bold text-center mb-12">
          Supported Domains
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {domains.map((domain, i) => (
            <div
              key={i}
              className="bg-white border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition"
            >
              <p className="font-semibold text-gray-700">
                {domain}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* Pricing */}
      <div className="bg-white py-16">

        <h3 className="text-3xl font-bold text-center mb-12">
          Free Plan
        </h3>

        <div className="flex justify-center">

          <div className="bg-white border rounded-2xl shadow-lg p-10 w-80 text-center">

            <h4 className="text-xl font-bold mb-4">
              Free Forever Plan
            </h4>

            <ul className="text-gray-600 space-y-3 mb-8">
              <li>✓ 3 Interviews / Month</li>
              <li>✓ Basic Feedback Report</li>
              <li>✓ Community Access</li>
            </ul>

            <button
              onClick={() => navigate("/start")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg w-full font-semibold"
            >
              Start for Free
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}