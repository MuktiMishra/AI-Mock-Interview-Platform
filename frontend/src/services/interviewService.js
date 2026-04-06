// Interview Service - handles all interview related API calls

import API from "../api/axios";

// Start a new interview
export const startInterview = async (data) => {
  try {
    const response = await API.post("/interview/start", data);
    return response.data;
  } catch (error) {
    console.error("Error starting interview:", error);
    throw error;
  }
};

// Get interview session details
export const getInterviewSession = async (id) => {
  try {
    const response = await API.get(`/interview/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching interview session:", error);
    throw error;
  }
};

// Submit answers
export const submitAnswers = async (id, answers) => {
  try {
    const response = await API.post(`/interview/${id}/submit`, { answers });
    return response.data;
  } catch (error) {
    console.error("Error submitting answers:", error);
    throw error;
  }
};