import api from "./axios";

export const startSession = (data) => api.post("/session/start", data);
export const getCurrentQuestion = (sessionId) =>
  api.get(`/session/${sessionId}/current`);
export const submitAnswer = (sessionId, formData) =>
  api.post(`/session/${sessionId}/answer`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const getSessionSummary = (sessionId) =>
  api.get(`/session/${sessionId}/summary`);
export const getSessionAnswers = (sessionId) =>
  api.get(`/session/${sessionId}/answers`);