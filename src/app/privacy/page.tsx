import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ProofLoop collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-sm text-white">
              P
            </span>
            ProofLoop
          </Link>
          <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
            Home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12 prose-sm">
        <h1 className="mb-2 text-3xl font-bold">Privacy Policy</h1>
        <p className="mb-8 text-sm text-[var(--muted)]">Last updated: August 19, 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-[var(--muted-strong)]">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">1. Overview</h2>
            <p>
              ProofLoop (“we”, “us”) provides an AI-powered platform to generate testimonials, case
              studies, and related marketing assets. This policy explains what data we collect and
              how we use it.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">2. Data we collect</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Account data: email, name, authentication credentials (via Supabase Auth).</li>
              <li>Content you submit: feedback text, case study fields, generated outputs you save.</li>
              <li>Usage data: approximate IP for rate limiting, product interactions.</li>
              <li>Billing data: handled by Stripe; we do not store full card numbers.</li>
            </ul>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">3. How we use data</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>To provide AI generation, storage, public pages, embeds, and referrals.</li>
              <li>To secure the service (auth, abuse prevention, rate limits).</li>
              <li>To process subscriptions and communicate about the product.</li>
            </ul>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">4. AI processing</h2>
            <p>
              Text you submit for generation may be sent to our AI provider (Google Gemini) to
              produce outputs. Do not submit secrets or regulated personal data you are not
              authorized to process.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">5. Sharing</h2>
            <p>
              We use subprocessors such as Supabase (database/auth), Vercel (hosting), Stripe
              (payments), and Google (AI). We do not sell your personal data.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">6. Retention &amp; deletion</h2>
            <p>
              You may delete saved stories in the product. Account deletion requests can be sent to{" "}
              <a className="text-[var(--primary)] underline" href="mailto:support@proofloop.app">
                support@proofloop.app
              </a>
              . We retain data as needed for security, legal, and billing requirements.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">7. Contact</h2>
            <p>
              Questions:{" "}
              <a className="text-[var(--primary)] underline" href="mailto:support@proofloop.app">
                support@proofloop.app
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
