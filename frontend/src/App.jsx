import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Results from "./pages/Results";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/interview/:sessionId" element={<Interview />} />
        <Route path="/results/:sessionId" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}