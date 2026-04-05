// Source of truth for what rounds exist in a drive.
// Keep this in sync with the frontend's copy in src/utils/drivePlan.js

export const DRIVE_ROUNDS = [
  { section: "aptitude",   label: "Aptitude",     totalQuestions: 10 },
  { section: "technical1", label: "Technical I",  totalQuestions: 10 },
  { section: "technical2", label: "Technical II", totalQuestions: 10 },
  { section: "hr",         label: "HR Round",     totalQuestions: 10 },
];

export const getRoundQuestionPlan = (section) =>
  Array.from({ length: 10 }, () => section);