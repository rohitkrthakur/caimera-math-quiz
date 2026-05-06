"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { useRouter } from "next/navigation";

export default function GamePage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [winner, setWinner] = useState("");
  const [scores, setScores] = useState<Record<string, number>>({});

  // Feedback states
  const [error, setError] = useState("");       // empty input message
  const [wrongMsg, setWrongMsg] = useState(""); // wrong answer message

  // Connect socket & join
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (!savedUsername) {
      router.push("/");
      return;
    }

    setUsername(savedUsername);
    socket.connect();
    socket.emit("join", savedUsername);

    socket.on("new-question", (newQuestion) => {
      setQuestion(newQuestion);
      setWinner("");
      setAnswer("");
      setError("");
      setWrongMsg(""); // clear any previous messages
    });

    socket.on("winner", (winnerName) => {
      setWinner(winnerName);
    });

    socket.on("leaderboard-update", (updatedScores) => {
      setScores(updatedScores);
    });

    // Listen for wrong answer feedback
    socket.on("wrong-answer", () => {
      setWrongMsg("Wrong answer! Try again.");
      setTimeout(() => setWrongMsg(""), 2500);
    });

    return () => {
      socket.off("new-question");
      socket.off("winner");
      socket.off("leaderboard-update");
      socket.off("wrong-answer");
      socket.disconnect();
    };
  }, [router]);

  // Submit answer
  const handleSubmit = () => {
    if (!answer.trim()) {
      setError("Please enter an answer");
      setTimeout(() => setError(""), 2500);
      return;
    }

    socket.emit("submit-answer", answer);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Main Game Area */}
        <div className="md:col-span-2 bg-zinc-900 p-8 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold mb-4">
            Welcome, {username} 👋☕
          </h1>

          <div className="bg-zinc-800 p-6 rounded-xl text-center mb-6">
            <h2 className="text-xl mb-2 text-zinc-400">Current Question</h2>
            <p className="text-4xl font-bold">{question}</p>
          </div>

          {/* Winner announcement */}
          {winner && (
            <div className="bg-green-600 p-3 rounded-lg mb-4 text-center font-semibold">
              {winner} 🍕🍟 solved it first!
            </div>
          )}

          {/* Error message for empty input */}
          {error && (
            <div className="bg-red-600/20 border border-red-600 text-red-300 p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          {/* Wrong answer message */}
          {wrongMsg && (
            <div className="bg-yellow-600/20 border border-yellow-600 text-yellow-300 p-3 rounded-lg mb-4 text-center">
              {wrongMsg}
            </div>
          )}

          {/* Answer Input */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter answer"
              value={answer}
              onChange={(e) => {
                const value = e.target.value;
                if (/^-?\d*$/.test(value)) {
                  setAnswer(value);
                }
              }}
              className="flex-1 p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 px-6 rounded-lg font-semibold"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
          <div className="space-y-3">
            {Object.entries(scores).map(([player, score]) => (
              <div
                key={player}
                className="flex justify-between bg-zinc-800 p-3 rounded-lg"
              >
                <span>{player}</span>
                <span>{score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}