"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStories, deleteStory, type Story } from "@/lib/storage";
import { AppHeader } from "@/components/app-header";

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    setStories(getStories());
  }, []);

  function handleDelete(id: string) {
    deleteStory(id);
    setStories(getStories());
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">My Stories</h1>
            <p className="text-[var(--muted)]">All your generated testimonials and case studies</p>
          </div>
          <Link href="/dashboard" className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            + New Story
          </Link>
        </div>
        {stories.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
            <p className="mb-4 text-[var(--muted)]">No stories yet.</p>
            <Link href="/dashboard" className="text-[var(--primary)] hover:underline">Generate your first story →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map((story) => (
              <div key={story.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[var(--primary)]/30">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-full bg-[var(--badge-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--primary)]">{story.type}</span>
                      <span className="text-xs text-[var(--muted)]">{new Date(story.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)]">{story.title}</h3>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link href={`/p/${story.id}`} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted-strong)] hover:bg-[var(--surface)]">Public page</Link>
                    <button onClick={() => handleDelete(story.id)} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-500 hover:bg-red-500/10">Delete</button>
                  </div>
                </div>
                <p className="line-clamp-2 text-sm text-[var(--muted)]">{story.content.slice(0, 180)}...</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
