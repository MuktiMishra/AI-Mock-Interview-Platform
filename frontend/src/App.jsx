import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Results from "./pages/Results";
import StartInterview from "./pages/StartInterview";
import InterviewSession  from "./pages/InterviewSession";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/interview" element={<InterviewSession />} />
        <Route path="/results/:sessionId" element={<Results />} />
        <Route path="/start" element={<StartInterview />} />

          <Route path="/interview/:id" element={<InterviewSession />} />
      </Routes>
    </BrowserRouter>
  );
}