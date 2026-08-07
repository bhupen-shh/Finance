"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (login(username, password)) {
      localStorage.setItem("loggedIn", "true");
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">

      <form
        onSubmit={handleLogin}
        className="w-[400px] rounded-xl bg-white p-8 shadow-xl"
      >

        <h1 className="mb-8 text-center text-3xl font-bold">
          Finance Tracker
        </h1>

        <input
          className="mb-4 w-full rounded border p-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="mb-4 w-full rounded border p-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="mb-4 text-red-500">{error}</p>
        )}

        <button
          className="w-full rounded bg-black py-3 text-white hover:bg-zinc-800"
        >
          Login
        </button>

      </form>
    </div>
  );
}