"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStories, deleteStory, type Story } from "@/lib/storage";
import { AppHeader } from "@/components/app-header";

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [filter, setFilter] = useState<"all" | Story["type"]>("all");

  useEffect(() => {
    setStories(getStories());
  }, []);

  function handleDelete(id: string) {
    deleteStory(id);
    setStories(getStories());
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

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
              My Stories
            </h1>
            <p className="mt-1 text-[var(--muted)]">
              Saved testimonials, case studies, and social packs — ready to share.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--primary)] px-5 text-sm font-semibold text-white hover:opacity-90"
          >
            + New story
          </Link>
        </div>

        {stories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
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
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
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

        {stories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--badge-bg)] text-[var(--primary)] text-lg font-bold">
              P
            </div>
            <p className="mb-1 text-base font-medium text-[var(--foreground)]">No stories yet</p>
            <p className="mb-6 text-sm text-[var(--muted)]">
              Generate a testimonial or case study — it will show up here.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center rounded-xl bg-[var(--primary)] px-6 text-sm font-semibold text-white hover:opacity-90"
            >
              Open generator →
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-10 text-center text-sm text-[var(--muted)]">
            No stories in this filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((story) => (
              <div
                key={story.id}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[var(--primary)]/35 hover:shadow-sm"
              >
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
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
                    <h3 className="truncate font-semibold text-[var(--foreground)]">{story.title}</h3>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/p/${story.id}`}
                      className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted-strong)] hover:bg-[var(--surface)]"
                    >
                      Public page
                    </Link>
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="rounded-lg border border-red-500/25 px-3 py-1.5 text-xs text-red-500 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
                  {story.content.slice(0, 200)}
                  {story.content.length > 200 ? "…" : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
