import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-6 text-center text-[var(--foreground)]">
      <p className="mb-2 text-sm font-medium text-[var(--primary)]">404</p>
      <h1 className="mb-2 text-2xl font-bold">Page not found</h1>
      <p className="mb-6 max-w-sm text-sm text-[var(--muted)]">
        The page you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
      >
        Go home
      </Link>
    </div>
  );
}
