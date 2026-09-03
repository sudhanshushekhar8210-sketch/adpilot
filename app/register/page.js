"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleRegister(e) {
    e.preventDefault();

    // Temporary registration
    // MongoDB authentication will be connected later.
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="text-2xl font-bold">
          Ad<span className="text-blue-500">Pilot</span>
        </Link>

        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <h1 className="text-3xl font-bold">Create account</h1>

          <p className="text-slate-400 mt-2">
            Start managing your Meta advertising.
          </p>

          <form onSubmit={handleRegister} className="mt-7 space-y-5">
            <div>
              <label className="block mb-2 text-sm">Name</label>

              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 outline-none focus:border-blue-500"
                placeholder="Your name"
              />
            </div>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 outline-none focus:border-blue-500"
                placeholder="Minimum 6 characters"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}