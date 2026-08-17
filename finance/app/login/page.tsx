"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Wallet, LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();
  const { login, signup, isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const result = isSignup 
        ? await signup(email, password)
        : await login(email, password);

      if (result.error) {
        setError(result.error);
        setPassword("");
      } else {
        // Success - redirect will happen automatically via useEffect
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Logo/Header */}
          <div className="flex items-center justify-center mb-8">
            <Wallet className="w-10 h-10 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Finance</h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {isSignup ? "Sign up to get started" : "Sign in to manage your expenses"}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 placeholder-gray-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 placeholder-gray-500"
                disabled={isLoading}
              />
              {isSignup && (
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {isLoading ? (isSignup ? "Creating account..." : "Signing in...") : (isSignup ? "Sign Up" : "Sign In")}
            </button>
          </form>

          {/* Toggle between login and signup */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={toggleMode}
                className="ml-1 text-blue-600 hover:text-blue-800 font-semibold"
              >
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>

          {/* Info message */}
          {!isSignup && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 font-medium mb-2">Demo Account:</p>
              <p className="text-sm text-gray-600">Email: <span className="font-mono font-semibold text-gray-800">demo@example.com</span></p>
              <p className="text-sm text-gray-600">Password: <span className="font-mono font-semibold text-gray-800">password123</span></p>
              <p className="text-xs text-gray-500 mt-2">Or create a new account using the form above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

