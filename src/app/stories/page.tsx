"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getStories,
  deleteStory,
  migrateLocalStoriesToCloud,
  type Story,
} from "@/lib/storage";
import { AppHeader } from "@/components/app-header";

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Story["type"]>("all");
  const [migrateMsg, setMigrateMsg] = useState("");

  async function load() {
    setLoading(true);
    try {
      const n = await migrateLocalStoriesToCloud();
      if (n > 0) setMigrateMsg(`Migrated ${n} local stor${n === 1 ? "y" : "ies"} to cloud.`);
      setStories(await getStories());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    await deleteStory(id);
    setStories(await getStories());
  }

  const filtered =
    filter === "all" ? stories : stories.filter((s) => s.type === filter);

  const counts = {
    all: stories.length,
    testimonial: stories.filter((s) => s.type === "testimonial").length,
    "case-study": stories.filter((s) => s.type === "case-study").length,
    social: stories.filter((s) => s.type === "social").length,
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <AppHeader
        links={[
          { href: "/dashboard", label: "Generator" },
          { href: "/stories", label: "Stories" },
          { href: "/embed", label: "Embed" },
          { href: "/referrals", label: "Referrals" },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Title row */}
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
              My Stories
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)] sm:text-base">
              Cloud-synced when logged in — available on any device.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] px-5 text-sm font-semibold text-white hover:opacity-90 sm:w-auto"
          >
            + New story
          </Link>
        </div>

        {migrateMsg && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-600">
            {migrateMsg}
          </div>
        )}

        {/* Filters — horizontal scroll on mobile */}
        {stories.length > 0 && (
          <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:mb-6 sm:flex-wrap sm:overflow-visible sm:px-0">
            {(
              [
                ["all", "All"],
                ["testimonial", "Testimonials"],
                ["case-study", "Case studies"],
                ["social", "Social"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  filter === id
                    ? "bg-[var(--primary)] text-white"
                    : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {label} ({counts[id]})
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)]/30 border-t-[var(--primary)]" />
          </div>
        ) : stories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] px-4 py-12 text-center sm:px-6 sm:py-16">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--badge-bg)] text-lg font-bold text-[var(--primary)]">
              P
            </div>
            <p className="mb-1 text-base font-medium text-[var(--foreground)]">No stories yet</p>
            <p className="mb-6 text-sm text-[var(--muted)]">
              Generate a testimonial or case study — it syncs to the cloud when logged in.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex h-11 w-full max-w-xs items-center justify-center rounded-xl bg-[var(--primary)] px-6 text-sm font-semibold text-white hover:opacity-90"
            >
              Open generator →
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted)] sm:p-10">
            No stories in this filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((story) => (
              <article
                key={story.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition hover:border-[var(--primary)]/35 sm:p-5"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[var(--badge-bg)] px-2.5 py-0.5 text-xs font-medium capitalize text-[var(--primary)]">
                    {story.type.replace("-", " ")}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {new Date(story.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h3 className="mb-2 break-words text-base font-semibold leading-snug text-[var(--foreground)]">
                  {story.title}
                </h3>

                <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-[var(--muted)] sm:line-clamp-2">
                  {story.content.slice(0, 200)}
                  {story.content.length > 200 ? "…" : ""}
                </p>

                {/* Actions: full-width stack on mobile */}
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Link
                    href={`/p/${story.id}`}
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--muted-strong)] hover:bg-[var(--surface)] sm:h-9 sm:flex-none sm:px-4"
                  >
                    Public page
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(story.id)}
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-red-500/25 text-sm font-medium text-red-500 hover:bg-red-500/10 sm:h-9 sm:flex-none sm:px-4"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
