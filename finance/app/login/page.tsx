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
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-gray-100"
      >
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900 tracking-tight">
          Finance Tracker
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-colors"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-colors"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="mb-4 text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors shadow-md"
        >
          Login
        </button>
      </form>
    </div>
  );
}