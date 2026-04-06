// Interview related constants

export const ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
];

export const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];

export const DOMAIN_OPTIONS = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "web-dev", label: "Web Development" },
  { value: "devops", label: "DevOps" },
];

// Default interview settings
export const DEFAULT_INTERVIEW_CONFIG = {
  role: "Software Engineer",
  difficulty: "Medium",
  domain: "web-dev",
  questionCount: 5,
};