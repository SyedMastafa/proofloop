"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PLANS, type PlanId } from "@/lib/plans";
import { AppHeader } from "@/components/app-header";
import { track } from "@/lib/track";

const faqs = [
  {
    q: "Can I start free?",
    a: "Yes. The Free plan includes 3 stories, AI polish, and public pages with ProofLoop branding — no card required.",
  },
  {
    q: "What counts as a story?",
    a: "Each saved testimonial, case study, or social pack counts as one story toward your plan limit.",
  },
  {
    q: "Can I remove branding?",
    a: "Starter and above can hide the Powered by ProofLoop badge on public pages and embeds.",
  },
  {
    q: "How does billing work?",
    a: "Paid plans are monthly via Stripe. Cancel anytime — you keep access until the end of the period.",
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    track("pricing_view");
  }, []);

  async function handleCheckout(planId: PlanId) {
    if (planId === "free") {
      window.location.href = "/signup";
      return;
    }
    track("checkout_started", { planId });
    setLoading(planId);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-4 text-center">
          <span
            className="mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-medium"
            style={{
              borderColor: "var(--badge-border)",
              background: "var(--badge-bg)",
              color: "var(--badge-text)",
            }}
          >
            Simple, transparent pricing
          </span>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
            Start free. Scale when proof works.
          </h1>
          <p className="mx-auto max-w-xl text-[var(--muted)]">
            Generate testimonials, case studies, embeds, and referrals. Upgrade only when your team
            needs more volume.
          </p>
        </div>

        {error && (
          <div className="mx-auto mb-8 max-w-lg rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6 transition ${
                plan.popular
                  ? "border-[var(--primary)] bg-[var(--badge-bg)] shadow-lg shadow-indigo-500/10 lg:-translate-y-1"
                  : "border-[var(--border)] bg-[var(--card)]"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-3 py-0.5 text-xs font-medium text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{plan.name}</h3>
              <p className="mt-1 min-h-[40px] text-sm text-[var(--muted)]">{plan.description}</p>
              <div className="mb-6 mt-5">
                <span className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
                  {plan.priceLabel}
                </span>
                {plan.price > 0 && <span className="text-[var(--muted)]">/mo</span>}
              </div>
              <ul className="mb-8 flex-1 space-y-2.5 text-sm text-[var(--muted-strong)]">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[var(--primary)]">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading === plan.id}
                className={`w-full rounded-xl py-3 text-sm font-semibold transition disabled:opacity-50 ${
                  plan.popular
                    ? "bg-[var(--primary)] text-white hover:opacity-90"
                    : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface)]"
                }`}
              >
                {loading === plan.id
                  ? "Loading..."
                  : plan.id === "free"
                  ? "Start free"
                  : "Subscribe"}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-[var(--muted)]">
          Payments powered by Stripe · Cancel anytime · Enterprise: custom pricing
        </p>

        <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <p className="text-sm leading-relaxed text-[var(--muted-strong)]">
            “We stopped waiting on case studies for sales calls. Generate, publish, share — same day.”
          </p>
          <p className="mt-3 text-xs font-medium text-[var(--foreground)]">Early team · B2B SaaS</p>
        </div>

        <div className="mx-auto mt-20 max-w-2xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-[var(--foreground)]">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={faq.q}
                className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-[var(--foreground)]"
                >
                  {faq.q}
                  <span className="text-[var(--muted)]">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <p className="border-t border-[var(--border)] px-5 py-4 text-sm leading-relaxed text-[var(--muted)]">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="mb-3 text-2xl font-bold text-[var(--foreground)]">Still deciding?</h2>
          <p className="mb-6 text-[var(--muted)]">
            Try the generator free — no card, no commitment.
          </p>
          <Link
            href="/signup"
            className="inline-flex h-12 items-center rounded-xl bg-[var(--primary)] px-8 text-sm font-semibold text-white hover:opacity-90"
          >
            Start for free today
          </Link>
        </div>
      </main>
    </div>
  );
}
