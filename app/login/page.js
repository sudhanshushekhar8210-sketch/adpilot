"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    // Temporary login
    // Real authentication will be connected later.
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="text-2xl font-bold">
          Ad<span className="text-blue-500">Pilot</span>
        </Link>

        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-slate-400 mt-2">
            Login to your AdPilot account.
          </p>

          <form onSubmit={handleLogin} className="mt-7 space-y-5">
            <div>
              <label className="block mb-2 text-sm">Email</label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 outline-none focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">Password</label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
            >
              Login
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-500">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}