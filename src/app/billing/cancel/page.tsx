import Link from "next/link";

export default function BillingCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-white">Checkout canceled</h1>
        <p className="mb-6 text-slate-400">
          No charge was made. You can upgrade anytime from the pricing page.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            View pricing
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-700 px-6 py-3 text-sm text-slate-300 hover:bg-slate-800"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
