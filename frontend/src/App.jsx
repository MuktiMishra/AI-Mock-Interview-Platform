import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Results from "./pages/Results";
import StartInterview from "./pages/StartInterview";
import InterviewSession from "./pages/InterviewSession";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ReportPage from "./pages/ReportPage";
import ProtectedRoute from "./pages/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/interview" element={<ProtectedRoute><InterviewSession /></ProtectedRoute>} />
        <Route path="/results/:sessionId" element={<Results />} />
        <Route path="/start" element={<ProtectedRoute><StartInterview /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/report/:id" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />

        <Route path="/interview/:id" element={<InterviewSession />} />
      </Routes>
    </BrowserRouter>
  );
}
