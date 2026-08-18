"use client";

import { useEffect, useState } from "react";
import { getReferralLinks, createReferralLink, type ReferralLink } from "@/lib/referral";
import { AppHeader } from "@/components/app-header";

export default function ReferralsPage() {
  const [links, setLinks] = useState<ReferralLink[]>([]);
  const [label, setLabel] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setLinks(getReferralLinks());
  }, []);

  function handleCreate() {
    createReferralLink(label || "Default");
    setLabel("");
    setLinks(getReferralLinks());
  }

  function copyLink(code: string) {
    navigator.clipboard.writeText(`${window.location.origin}/r/${code}`);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-2 text-2xl font-bold text-[var(--foreground)]">Referral Links</h1>
        <p className="mb-8 text-[var(--muted)]">Share unique links. Track clicks and signups. Product-led growth built in.</p>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (e.g. Twitter, Partner)"
            className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
          />
          <button onClick={handleCreate} className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90">
            Create link
          </button>
        </div>
        {links.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center text-[var(--muted)]">
            No referral links yet. Create one above.
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <div key={link.id} className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-medium text-[var(--foreground)]">{link.label}</div>
                  <div className="mt-1 font-mono text-sm text-[var(--primary)]">/r/{link.code}</div>
                  <div className="mt-2 flex gap-4 text-xs text-[var(--muted)]">
                    <span>{link.clicks} clicks</span>
                    <span>{link.signups} signups</span>
                  </div>
                </div>
                <button onClick={() => copyLink(link.code)} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-strong)] hover:bg-[var(--surface)]">
                  {copied === link.code ? "Copied!" : "Copy link"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
