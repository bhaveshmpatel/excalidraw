"use client";

import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage({ isSignin }: { isSignin: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const endpoint = isSignin ? "/signin" : "/signup";
      const payload = isSignin ? { username: email, password } : { username: email, password, name };

      const response = await axios.post(`${HTTP_BACKEND}${endpoint}`, payload);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (isSignin) {
        router.push("/");
      } else {
        router.push("/signin");
      }
    } catch (e: any) {
      setError(e.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{isSignin ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-zinc-400">{isSignin ? "Sign in to access your canvas" : "Sign up to start drawing"}</p>
        </div>

        <div className="space-y-4">
          {!isSignin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all placeholder:text-zinc-600 font-medium"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email</label>
            <input
              type="text"
              placeholder="john@example.com"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all placeholder:text-zinc-600 font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all placeholder:text-zinc-600 font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Processing..." : isSignin ? "Sign In" : "Sign Up"}
          </button>

          <div className="text-center text-sm text-zinc-400">
            {isSignin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Link href={isSignin ? "/signup" : "/signin"} className="text-purple-400 hover:text-purple-300 font-medium hover:underline">
              {isSignin ? "Sign up" : "Sign in"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
