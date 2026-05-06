"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    // basic validation
    if (!username.trim()) {
      console.log("Username is empty");
      return;
    }

    console.log("Joining game with username:", username);

    // saving username for game page
    localStorage.setItem("username", username);

    // redirecting to game page
    router.push("/game");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          Competitive Math Quiz
        </h1>

        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none mb-4"
        />

        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold"
        >
          Join Game
        </button>
      </div>
    </div>
  );
}