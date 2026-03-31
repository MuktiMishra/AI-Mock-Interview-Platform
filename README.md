# AI Mock Interview Platform (MVP)

A **free + self-hosted** AI mock interview platform built to simulate real interview rounds with **timed questions** and **recorded answers**.  
This repository contains an MVP implementation focused on **speed of development** and an **end-to-end working flow**.

> **MVP Today Includes:** Auth → Dashboard → Start Interview → Timed Questions → Audio Recording → Save Attempt  
> **Planned Next:** AI transcription + scoring + dynamic cross-questions + admin panel + coding round

---

## Features (MVP) - Completed

- User **Register / Login** (JWT)
- Dashboard to choose:
  - Interview **Domain**
  - Difficulty **Level** (Fresher / Intermediate / Advanced)
- Interview session engine:
  - **Question on screen**
  - **Timer countdown**
  - **Auto-move to next question**
- **Audio recording** via browser MediaRecorder API
- Upload recorded audio to backend (`multipart/form-data`)
- Session + answer storage in MongoDB
- Basic attempt completion page

---

## Roadmap (Planned)

- 🔜 Admin panel (question bank CRUD, templates per domain/level)
- 🔜 Aptitude + Technical 1 + Technical 2 + HR rounds
- 🔜 Coding round (Monaco editor + Docker sandbox execution)
- 🔜 AI Service (self-hosted, no paid APIs):
  - `faster-whisper` for transcription
  - Local LLM (Ollama / llama.cpp / vLLM) for:
    - answer analysis
    - scoring
    - dynamic cross-questions
- 🔜 Cross-question rules:
  - Fresher: 3 cross-questions (from 3 different answers)
  - Intermediate: 5 cross-questions (from 5 different answers)
  - Advanced: 7 cross-questions (from 7 different answers)

---

## Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- MediaRecorder API (audio capture)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Auth
- Multer (audio upload)
- (Later) Redis + BullMQ, Socket.IO

---

