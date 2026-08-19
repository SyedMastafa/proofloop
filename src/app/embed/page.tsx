"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";

export default function EmbedPage() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [copied, setCopied] = useState(false);
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://your-domain.com";
  const embedCode = `<div id="proofloop-widget"></div>\n<script src="${origin}/api/embed?theme=${theme}&limit=5" async></script>`;

  function copy() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const previewBg = theme === "dark" ? "#0b1220" : "#ffffff";
  const previewText = theme === "dark" ? "#e2e8f0" : "#0f172a";
  const previewMuted = theme === "dark" ? "#94a3b8" : "#64748b";
  const previewBorder = theme === "dark" ? "#1e293b" : "#e2e8f0";
  const previewCard = theme === "dark" ? "#030712" : "#f8fafc";

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
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Embeddable widget
          </h1>
          <p className="mt-1 max-w-xl text-[var(--muted)]">
            One snippet. Social proof on any site — with Powered by ProofLoop branding on free plans.
          </p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          {[
            { t: "No code required", d: "Paste into Webflow, WordPress, or HTML" },
            { t: "Theme match", d: "Light or dark to fit your brand" },
            { t: "Always on-brand", d: "Optional ProofLoop badge drives PLG" },
          ].map((x) => (
            <div
              key={x.t}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
            >
              <p className="text-sm font-medium text-[var(--foreground)]">{x.t}</p>
              <p className="text-xs text-[var(--muted)]">{x.d}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Widget theme</h2>
            <div className="flex gap-2">
              {(["light", "dark"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize ${
                    theme === t
                      ? "bg-[var(--primary)] text-white"
                      : "border border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-[var(--muted-strong)]">Embed code</h2>
            <button
              onClick={copy}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted-strong)] hover:bg-[var(--surface)]"
            >
              {copied ? "Copied!" : "Copy code"}
            </button>
          </div>
          <pre className="mb-8 overflow-x-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs leading-relaxed text-[var(--muted-strong)]">
            {embedCode}
          </pre>

          <h2 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Live preview</h2>
          <div
            className="rounded-xl border p-5"
            style={{ background: previewBg, borderColor: previewBorder }}
          >
            <div className="space-y-3">
              {[
                {
                  q: "ProofLoop helped us turn customer feedback into polished case studies in minutes.",
                  a: "Sarah Chen, Head of Growth",
                },
                {
                  q: "We went from chasing testimonials for weeks to publishing success stories the same day.",
                  a: "Marcus Rivera, Founder",
                },
              ].map((item) => (
                <div
                  key={item.a}
                  className="rounded-xl border p-4"
                  style={{ background: previewCard, borderColor: previewBorder }}
                >
                  <p className="mb-2 text-sm leading-relaxed" style={{ color: previewText }}>
                    “{item.q}”
                  </p>
                  <p className="text-xs" style={{ color: previewMuted }}>
                    — {item.a}
                  </p>
                </div>
              ))}
              <p className="pt-1 text-center text-xs" style={{ color: previewMuted }}>
                Powered by <span style={{ color: "#6366f1" }}>ProofLoop</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
