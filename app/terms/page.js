import Link from "next/link";

export default function Terms() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="text-2xl font-bold">
          Ad<span className="text-blue-500">Pilot</span>
        </Link>

        <article className="mt-10 prose prose-invert max-w-none">
          <h1>Terms & Conditions</h1>

          <p>Last updated: September 3, 2026</p>

          <h2>1. Service</h2>

          <p>
            AdPilot provides software tools for managing advertising activities
            through supported third-party platforms.
          </p>

          <h2>2. User Account</h2>

          <p>
            You are responsible for maintaining the security of your account
            and for activity performed through your account.
          </p>

          <h2>3. Meta Accounts</h2>

          <p>
            Users are responsible for ensuring that they have the necessary
            authorization to connect and manage any Meta advertising assets
            through AdPilot.
          </p>

          <h2>4. Advertising</h2>

          <p>
            AdPilot does not guarantee approval, delivery, reach, conversions,
            or performance of advertisements. Advertisements remain subject to
            applicable platform policies and review processes.
          </p>

          <h2>5. Prohibited Use</h2>

          <p>
            Users must not use the service for unlawful activities, deceptive
            advertising, abuse of third-party platforms, or activities that
            violate applicable laws or platform policies.
          </p>

          <h2>6. Changes</h2>

          <p>
            We may modify these terms when necessary. Continued use of the
            service after changes constitutes acceptance of the updated terms.
          </p>

          <h2>7. Contact</h2>

          <p>
            Questions regarding these terms can be directed to the support
            contact provided by AdPilot.
          </p>
        </article>
      </div>
    </main>
  );
}