"use client";

import { useEffect, useState } from "react";
import {
  getReferralLinks,
  createReferralLink,
  type ReferralLink,
} from "@/lib/referral";
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

  const totalClicks = links.reduce((s, l) => s + l.clicks, 0);
  const totalSignups = links.reduce((s, l) => s + l.signups, 0);

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
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Referral links
          </h1>
          <p className="mt-1 text-[var(--muted)]">
            Share unique links. Track clicks and signups. Turn customers into a growth channel.
          </p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Links</p>
            <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{links.length}</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Clicks</p>
            <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{totalClicks}</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Signups</p>
            <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{totalSignups}</p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="mb-3 text-sm font-medium text-[var(--foreground)]">Create a link</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Label (e.g. Twitter, Partner, Newsletter)"
              className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <button
              onClick={handleCreate}
              className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Create link
            </button>
          </div>
        </div>

        {links.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] px-6 py-14 text-center">
            <p className="mb-1 font-medium text-[var(--foreground)]">No referral links yet</p>
            <p className="text-sm text-[var(--muted)]">
              Create one above and share it with partners or customers.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-semibold text-[var(--foreground)]">{link.label}</div>
                  <div className="mt-1 font-mono text-sm text-[var(--primary)]">/r/{link.code}</div>
                  <div className="mt-2 flex gap-4 text-xs text-[var(--muted)]">
                    <span>{link.clicks} clicks</span>
                    <span>{link.signups} signups</span>
                  </div>
                </div>
                <button
                  onClick={() => copyLink(link.code)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--muted-strong)] hover:bg-[var(--surface)]"
                >
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
