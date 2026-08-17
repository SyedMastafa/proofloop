"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getStory, type Story } from "@/lib/storage";

export default function PublicStoryPage() {
  const params = useParams();
  const id = params.id as string;
  const [story, setStory] = useState<Story | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setStory(getStory(id));
  }, [id]);

  if (!story) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center">
          <h1 className="mb-2 text-xl font-semibold">Story not found</h1>
          <p className="mb-4 text-slate-400">
            This story may have been deleted or the link is invalid.
          </p>
          <Link href="/" className="text-indigo-400 hover:underline">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500 text-xs font-bold text-white">
              P
            </div>
            <span className="text-sm font-medium text-slate-400">
              Powered by ProofLoop
            </span>
          </Link>
          <button
            onClick={handleShare}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 transition"
          >
            {copied ? "Copied!" : "Share link"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-6 flex items-center gap-2">
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300">
            {story.type === "case-study"
              ? "Case Study"
              : story.type === "testimonial"
              ? "Testimonial"
              : "Social Proof"}
          </span>
          <span className="text-xs text-slate-500">
            {new Date(story.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <h1 className="mb-8 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {story.title}
        </h1>

        {(story.customerName || story.companyName) && (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-semibold text-indigo-300">
              {(story.customerName || story.companyName || "C")[0].toUpperCase()}
            </div>
            <div>
              {story.customerName && (
                <div className="font-medium text-white">{story.customerName}</div>
              )}
              {story.companyName && (
                <div className="text-sm text-slate-400">{story.companyName}</div>
              )}
            </div>
          </div>
        )}

        <article className="prose prose-invert prose-slate max-w-none">
          <div className="whitespace-pre-wrap text-base leading-relaxed text-slate-300">
            {story.content}
          </div>
        </article>

        <div className="mt-16 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-cyan-500/5 p-8 text-center">
          <p className="mb-3 text-sm text-slate-400">
            This success story was created with
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-lg font-semibold text-white hover:text-indigo-300 transition"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500 text-xs font-bold">
              P
            </div>
            ProofLoop
          </Link>
          <p className="mt-3 text-sm text-slate-500">
            Turn your customers' success into automated marketing.
          </p>
          <Link
            href="/signup"
            className="mt-5 inline-block rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-400 transition"
          >
            Start free →
          </Link>
        </div>
      </main>
    </div>
  );
}
