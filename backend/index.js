import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

import {
  setQuestion,
  submitAnswer,
  getCurrentState,
} from "./gameManager.js";

import { generateQuestion } from "./questionGenerator.js";

dotenv.config();

const app = express();

// allowing frontend url
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

// creating http server for socket.io
const server = http.createServer(app);

// socket setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

// setting first question when server starts
const firstQ = generateQuestion();
setQuestion(firstQ.question, firstQ.answer);

// socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // user joins game
  socket.on("join", (username) => {
    console.log(`${username} joined`);

    socket.data.username = username;

    const state = getCurrentState();

    // sending current question
    socket.emit("new-question", state.question);

    // sending leaderboard
    socket.emit("leaderboard-update", state.scores);
  });

  // answer submit
  socket.on("submit-answer", (answer) => {
    const username = socket.data.username;

    console.log(`${username} submitted: ${answer}`);

    const result = submitAnswer(username, answer);

    // wrong answer
    if (!result) {
      socket.emit("wrong-answer", "❌ Wrong answer, try again!");
      return;
    }

    // correct answer
    console.log(`Winner: ${result.winner}`);

    io.emit("winner", result.winner);

    io.emit("leaderboard-update", result.scores);

    // next question after small delay
    setTimeout(() => {
      const newQ = generateQuestion();

      setQuestion(newQ.question, newQ.answer);

      console.log("New question generated");

      io.emit("new-question", newQ.question);
    }, 3000);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});