"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "your plan";
  const mock = searchParams.get("mock");

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
      <div className="mb-4 text-4xl">✓</div>
      <h1 className="mb-2 text-2xl font-bold text-white">You're in!</h1>
      <p className="mb-6 text-slate-400">
        {mock
          ? "Mock checkout complete (Stripe keys not set). In production this confirms payment."
          : `Your ${plan} subscription is active.`}
      </p>
      <Link
        href="/dashboard"
        className="inline-block rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
      >
        Go to Dashboard →
      </Link>
    </div>
  );
}

export default function BillingSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <Suspense fallback={<div className="text-slate-400">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
