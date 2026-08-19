import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the ProofLoop product.",
};

export default function TermsPage() {
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
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold">Terms of Service</h1>
        <p className="mb-8 text-sm text-[var(--muted)]">Last updated: August 19, 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-[var(--muted-strong)]">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">1. Acceptance</h2>
            <p>
              By accessing ProofLoop you agree to these Terms. If you use the product on behalf of an
              organization, you represent that you have authority to bind that organization.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">2. The service</h2>
            <p>
              ProofLoop provides tools to generate and publish customer proof (testimonials, case
              studies, social drafts, embeds, referrals). Features and limits vary by plan.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">3. Your content</h2>
            <p>
              You retain rights to content you submit. You grant us a license to process it to
              operate the service (including AI generation and hosting public pages you enable).
              You are responsible for having rights to any customer data you upload.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">4. Acceptable use</h2>
            <p>
              Do not abuse the API, attempt unauthorized access, generate unlawful or deceptive
              content, or resell the service without permission. We may suspend accounts that
              violate these rules.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">5. AI outputs</h2>
            <p>
              AI-generated text may be inaccurate or generic. You are responsible for reviewing
              outputs before publishing. ProofLoop is not liable for business decisions based solely
              on generated content.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">6. Billing</h2>
            <p>
              Paid plans are billed via Stripe. Fees are non-refundable except where required by
              law. You may cancel anytime; access continues until the end of the billing period.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">7. Disclaimer</h2>
            <p>
              The service is provided “as is” without warranties of uninterrupted availability or
              fitness for a particular purpose, to the fullest extent permitted by law.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">8. Contact</h2>
            <p>
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
