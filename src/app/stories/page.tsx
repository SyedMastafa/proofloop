"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStories, deleteStory, type Story } from "@/lib/storage";

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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold text-white">
              P
            </div>
            <span className="text-lg font-semibold">ProofLoop</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/dashboard"
              className="text-slate-400 hover:text-white transition"
            >
              Generator
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Stories</h1>
            <p className="text-slate-400">
              All your generated testimonials and case studies
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 transition"
          >
            + New Story
          </Link>
        </div>

        {stories.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <p className="mb-4 text-slate-400">No stories yet.</p>
            <Link
              href="/dashboard"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Generate your first story →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 hover:border-slate-700 transition"
              >
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
                        {story.type}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white">{story.title}</h3>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link
                      href={`/p/${story.id}`}
                      className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 transition"
                    >
                      Public page
                    </Link>
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="line-clamp-2 text-sm text-slate-400">
                  {story.content.slice(0, 180)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
