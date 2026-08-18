"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "your plan";
  const mock = searchParams.get("mock");

  return (
    <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
      <div className="mb-4 text-4xl text-emerald-500">✓</div>
      <h1 className="mb-2 text-2xl font-bold text-[var(--foreground)]">You&apos;re in!</h1>
      <p className="mb-6 text-[var(--muted)]">
        {mock
          ? "Mock checkout complete (Stripe keys not set). In production this confirms payment."
          : `Your ${plan} subscription is active.`}
      </p>
      <Link href="/dashboard" className="inline-block rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90">
        Go to Dashboard →
      </Link>
    </div>
  );
}

export default function BillingSuccessPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <Suspense fallback={<div className="text-[var(--muted)]">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
