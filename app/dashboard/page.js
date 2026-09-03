"use client";

import Link from "next/link";

export default function DashboardPage() {
  const connectMeta = () => {
    window.location.href = "/api/auth/meta";
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Ad<span className="text-blue-500">Pilot</span>
          </Link>

          <Link
            href="/"
            className="text-slate-400 hover:text-white transition"
          >
            Logout
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-slate-400 mt-2">
          Manage your Meta advertising from here.
        </p>

        {/* Connection Status */}
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          <Card title="Ad Account" value="Not Connected" />
          <Card title="Facebook Page" value="Not Connected" />
          <Card title="Instagram" value="Not Connected" />
        </div>

        {/* Meta Connection */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <h2 className="text-2xl font-bold">
            Connect Facebook & Instagram
          </h2>

          <p className="text-slate-400 mt-2 max-w-2xl">
            Connect your Meta account to allow AdPilot to work with your
            authorized advertising assets.
          </p>

          <button
            onClick={connectMeta}
            className="mt-6 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
          >
            Connect Facebook & Instagram
          </button>
        </div>

        {/* Create Advertisement */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-7">
          <h2 className="text-2xl font-bold">
            Create Advertisement
          </h2>

          <p className="text-slate-400 mt-2">
            After connecting your Meta account, you'll be able to create
            advertisements here.
          </p>

          <button
            disabled
            className="mt-6 px-6 py-3 rounded-xl border border-slate-700 text-slate-500 cursor-not-allowed"
          >
            Create Ad — Coming Next
          </button>
        </div>
      </div>
    </main>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <p className="text-slate-400">{title}</p>

      <h3 className="text-xl font-semibold mt-2">
        {value}
      </h3>
    </div>
  );
}