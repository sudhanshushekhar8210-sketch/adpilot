import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="text-2xl font-bold">
          Ad<span className="text-blue-500">Pilot</span>
        </div>

        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 mb-6">
          Meta Ads Automation
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Create Meta Ads
          <br />
          <span className="text-blue-500">Without the Complexity.</span>
        </h1>

        <p className="mt-6 text-slate-400 text-lg max-w-2xl mx-auto">
          Connect your Facebook and Instagram accounts, provide your
          advertisement content, and manage your Meta advertising from one
          simple dashboard.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/register"
            className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
          >
            Start Free
          </Link>

          <Link
            href="/login"
            className="px-7 py-3 rounded-xl border border-slate-700 hover:bg-slate-800"
          >
            Login
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        <Feature
          title="Connect Meta"
          text="Connect your Facebook and Instagram advertising accounts securely."
        />

        <Feature
          title="Create Campaigns"
          text="Prepare your advertisement content and launch campaigns from one place."
        />

        <Feature
          title="Track Results"
          text="View your advertising performance from your dashboard."
        />
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <div className="flex justify-center gap-5 mb-3">
          <Link href="/privacy-policy" className="hover:text-white">
            Privacy Policy
          </Link>

          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>

          <Link href="/data-deletion" className="hover:text-white">
            Data Deletion
          </Link>
        </div>

        © 2026 AdPilot. All rights reserved.
      </footer>
    </main>
  );
}

function Feature({ title, text }) {
  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-slate-400">{text}</p>
    </div>
  );
}