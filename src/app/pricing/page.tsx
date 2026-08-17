"use client";

import { useState } from "react";
import Link from "next/link";
import { PLANS, type PlanId } from "@/lib/plans";

export default function PricingPage() {
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [error, setError] = useState("");

  async function handleCheckout(planId: PlanId) {
    if (planId === "free") {
      window.location.href = "/signup";
      return;
    }
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
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold text-white">P</div>
            <span className="text-lg font-semibold">ProofLoop</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">Dashboard</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold text-white">Simple pricing</h1>
          <p className="text-slate-400">Start free. Upgrade when you need more stories and team features.</p>
        </div>

        {error && (
          <div className="mx-auto mb-8 max-w-lg rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.popular
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-slate-800 bg-slate-900/50"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-0.5 text-xs font-medium text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold text-white">{plan.priceLabel}</span>
                {plan.price > 0 && <span className="text-slate-400">/mo</span>}
              </div>
              <ul className="mb-8 flex-1 space-y-2 text-sm text-slate-400">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-indigo-400">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading === plan.id}
                className={`w-full rounded-xl py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
                  plan.popular
                    ? "bg-indigo-500 text-white hover:bg-indigo-400"
                    : "border border-slate-700 text-slate-200 hover:bg-slate-800"
                }`}
              >
                {loading === plan.id
                  ? "Loading..."
                  : plan.id === "free"
                  ? "Get started"
                  : "Subscribe"}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-slate-500">
          Payments powered by Stripe. Cancel anytime. Enterprise: contact us.
        </p>
      </main>
    </div>
  );
}
