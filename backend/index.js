import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import {createServer} from 'http'
import {Server} from 'socket.io'
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import driveRouter from "./routes/drive.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



dotenv.config();

const app = express();
const server = createServer(app); 
const io = new Server(server)

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/session", sessionRoutes);
app.use("/drive", driveRouter)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

io.on('connection', (socket) => {
    console.log("a user connected, socketid:", socket.id); 
})

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
    server.listen(8000, () => console.log("Server running on port 8000"));
})
.catch(err => console.log(err));
