import Link from "next/link";

export default function DataDeletion() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="text-2xl font-bold">
          Ad<span className="text-blue-500">Pilot</span>
        </Link>

        <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h1 className="text-3xl font-bold">
            User Data Deletion
          </h1>

          <p className="text-slate-400 mt-5">
            You can request deletion of your AdPilot account and associated
            data at any time.
          </p>

          <h2 className="text-xl font-semibold mt-8">
            How to request deletion
          </h2>

          <ol className="list-decimal list-inside mt-4 text-slate-300 space-y-2">
            <li>Contact AdPilot support.</li>
            <li>Provide the email address associated with your account.</li>
            <li>Request account and data deletion.</li>
          </ol>

          <div className="mt-8 p-5 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-slate-400">
              Replace this section with your real support email before
              submitting your website to Meta.
            </p>

            <p className="mt-2 font-semibold">
              support@yourdomain.com
            </p>
          </div>

          <p className="text-slate-500 text-sm mt-8">
            We may retain information where required by law or where reasonably
            necessary for legitimate legal and security purposes.
          </p>
        </div>
      </div>
    </main>
  );
}