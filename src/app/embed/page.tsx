"use client";

import { useState } from "react";
import Link from "next/link";

export default function EmbedPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [copied, setCopied] = useState(false);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://your-domain.com";

  const embedCode = `<div id="proofloop-widget"></div>\n<script src="${origin}/api/embed?theme=${theme}&limit=5" async></script>`;

  function copy() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold text-white">
              P
            </div>
            <span className="text-lg font-semibold">ProofLoop</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold text-white">Embeddable Widget</h1>
        <p className="mb-8 text-slate-400">
          Drop this on any website to show testimonials. Includes Powered by ProofLoop branding.
        </p>

        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setTheme("dark")}
            className={`rounded-lg px-4 py-2 text-sm ${
              theme === "dark" ? "bg-indigo-500 text-white" : "border border-slate-700 text-slate-300"
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => setTheme("light")}
            className={`rounded-lg px-4 py-2 text-sm ${
              theme === "light" ? "bg-indigo-500 text-white" : "border border-slate-700 text-slate-300"
            }`}
          >
            Light
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-300">Embed code</h2>
          <button
            onClick={copy}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="mb-10 overflow-x-auto rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300 whitespace-pre-wrap">
          {embedCode}
        </pre>

        <h2 className="mb-4 text-lg font-semibold text-white">Live preview</h2>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
              <p className="mb-2 text-sm leading-relaxed text-slate-200">
                &quot;ProofLoop helped us turn customer feedback into polished case studies in minutes.&quot;
              </p>
              <p className="text-xs text-slate-500">— Sarah Chen, Head of Growth</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
              <p className="mb-2 text-sm leading-relaxed text-slate-200">
                &quot;We went from chasing testimonials for weeks to publishing success stories the same day.&quot;
              </p>
              <p className="text-xs text-slate-500">— Marcus Rivera, Founder</p>
            </div>
            <p className="pt-2 text-center text-xs text-slate-500">
              Powered by <span className="text-indigo-400">ProofLoop</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
