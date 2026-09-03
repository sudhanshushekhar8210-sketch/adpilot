import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="text-2xl font-bold">
          Ad<span className="text-blue-500">Pilot</span>
        </Link>

        <article className="mt-10 prose prose-invert max-w-none">
          <h1>Privacy Policy</h1>

          <p>
            Last updated: September 3, 2026
          </p>

          <h2>1. Introduction</h2>

          <p>
            AdPilot provides tools that help users manage and automate
            advertising activities through supported Meta platforms.
          </p>

          <h2>2. Information We Collect</h2>

          <p>
            We may collect information required to create and manage your
            account, including your name, email address, and account
            credentials.
          </p>

          <p>
            When you choose to connect a Meta account, we may receive
            information and permissions authorized by you through Meta's
            authorization system.
          </p>

          <h2>3. How We Use Information</h2>

          <p>
            Information is used to provide account functionality, connect
            authorized advertising assets, provide advertising management
            features, maintain security, and improve our services.
          </p>

          <h2>4. Meta Platform Data</h2>

          <p>
            If you connect a Meta account, AdPilot only accesses information
            permitted by the authorization you provide. We use such
            information only for the purposes disclosed through our service
            and applicable Meta policies.
          </p>

          <h2>5. Data Security</h2>

          <p>
            We use reasonable technical and organizational measures to protect
            account information and authorized platform data.
          </p>

          <h2>6. Data Retention</h2>

          <p>
            We retain information only for as long as reasonably necessary to
            provide our services, comply with legal obligations, resolve
            disputes, and enforce agreements.
          </p>

          <h2>7. Data Deletion</h2>

          <p>
            You may request deletion of your account and associated data.
            Please visit our Data Deletion page for instructions.
          </p>

          <h2>8. Third-Party Services</h2>

          <p>
            Our service may interact with third-party platforms such as Meta.
            Your use of those platforms is also subject to their respective
            terms and privacy policies.
          </p>

          <h2>9. Changes</h2>

          <p>
            We may update this Privacy Policy from time to time. Updated
            versions will be published on this page.
          </p>

          <h2>10. Contact</h2>

          <p>
            For privacy questions or data deletion requests, contact us using
            the support contact provided by AdPilot.
          </p>
        </article>
      </div>
    </main>
  );
}