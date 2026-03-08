import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import {createServer} from 'http'
import {Server} from 'socket.io'
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();
const server = createServer(app); 
const io = new Server(server)

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/session", sessionRoutes);

io.on('connection', (socket) => {
    console.log("a user connected, socketid:", socket.id); 
})

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
    server.listen(5000, () => console.log("Server running on port 5000"));
})
.catch(err => console.log(err));
