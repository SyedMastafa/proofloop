"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getStory, type Story } from "@/lib/storage";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PublicStoryPage() {
  const params = useParams();
  const id = params.id as string;
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const s = await getStory(id);
      if (!cancelled) {
        setStory(s);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)]/30 border-t-[var(--primary)]" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <div className="text-center">
          <h1 className="mb-2 text-xl font-semibold">Story not found</h1>
          <p className="mb-4 text-[var(--muted)]">
            This story may have been deleted or the link is invalid.
          </p>
          <Link href="/" className="text-[var(--primary)] hover:underline">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-xs font-bold text-white">
              P
            </div>
            <span className="text-sm font-medium text-[var(--muted)]">Powered by ProofLoop</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleShare}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted-strong)] hover:bg-[var(--surface)]"
            >
              {copied ? "Copied!" : "Share link"}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-6 flex items-center gap-2">
          <span className="rounded-full bg-[var(--badge-bg)] px-3 py-1 text-xs font-medium text-[var(--primary)]">
            {story.type === "case-study"
              ? "Case Study"
              : story.type === "testimonial"
              ? "Testimonial"
              : "Social Proof"}
          </span>
          <span className="text-xs text-[var(--muted)]">
            {new Date(story.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
          {story.title}
        </h1>
        {(story.customerName || story.companyName) && (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--badge-bg)] text-sm font-semibold text-[var(--primary)]">
              {(story.customerName || story.companyName || "C")[0].toUpperCase()}
            </div>
            <div>
              {story.customerName && (
                <div className="font-medium text-[var(--foreground)]">{story.customerName}</div>
              )}
              {story.companyName && (
                <div className="text-sm text-[var(--muted)]">{story.companyName}</div>
              )}
            </div>
          </div>
        )}
        <article>
          <div className="whitespace-pre-wrap text-base leading-relaxed text-[var(--muted-strong)]">
            {story.content}
          </div>
        </article>
        <div className="mt-16 rounded-2xl border border-[var(--primary)]/30 bg-[var(--badge-bg)] p-8 text-center">
          <p className="mb-3 text-sm text-[var(--muted)]">This success story was created with</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-lg font-semibold text-[var(--foreground)] hover:text-[var(--primary)]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-xs font-bold text-white">
              P
            </div>
            ProofLoop
          </Link>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Turn your customers&apos; success into automated marketing.
          </p>
          <Link
            href="/signup"
            className="mt-5 inline-block rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Start free →
          </Link>
        </div>
      </main>
    </div>
  );
}
