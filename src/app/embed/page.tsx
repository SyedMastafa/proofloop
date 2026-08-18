"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";

export default function EmbedPage() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "https://your-domain.com";
  const embedCode = `<div id="proofloop-widget"></div>\n<script src="${origin}/api/embed?theme=${theme}&limit=5" async></script>`;

  function copy() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold text-[var(--foreground)]">Embeddable Widget</h1>
        <p className="mb-8 text-[var(--muted)]">Drop this on any website to show testimonials. Includes Powered by ProofLoop branding.</p>
        <div className="mb-6 flex gap-3">
          {(["dark", "light"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`rounded-lg px-4 py-2 text-sm capitalize ${
                theme === t ? "bg-[var(--primary)] text-white" : "border border-[var(--border)] text-[var(--muted-strong)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-[var(--muted-strong)]">Embed code</h2>
          <button onClick={copy} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] hover:bg-[var(--surface)]">
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="mb-10 overflow-x-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted-strong)]">{embedCode}</pre>
        <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Live preview</h2>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="space-y-3">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="mb-2 text-sm leading-relaxed text-[var(--foreground)]">&quot;ProofLoop helped us turn customer feedback into polished case studies in minutes.&quot;</p>
              <p className="text-xs text-[var(--muted)]">— Sarah Chen, Head of Growth</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="mb-2 text-sm leading-relaxed text-[var(--foreground)]">&quot;We went from chasing testimonials for weeks to publishing success stories the same day.&quot;</p>
              <p className="text-xs text-[var(--muted)]">— Marcus Rivera, Founder</p>
            </div>
            <p className="pt-2 text-center text-xs text-[var(--muted)]">
              Powered by <span className="text-[var(--primary)]">ProofLoop</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
