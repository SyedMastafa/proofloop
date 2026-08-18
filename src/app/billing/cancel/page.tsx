import Link from "next/link";

export default function BillingCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-[var(--foreground)]">Checkout canceled</h1>
        <p className="mb-6 text-[var(--muted)]">
          No charge was made. You can upgrade anytime from the pricing page.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/pricing" className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90">
            View pricing
          </Link>
          <Link href="/dashboard" className="rounded-xl border border-[var(--border)] px-6 py-3 text-sm text-[var(--muted-strong)] hover:bg-[var(--surface)]">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
