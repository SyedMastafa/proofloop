"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getReferralLinks,
  createReferralLink,
  type ReferralLink,
} from "@/lib/referral";

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
    const url = `${window.location.origin}/r/${code}`;
    navigator.clipboard.writeText(url);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold text-white">P</div>
            <span className="text-lg font-semibold">ProofLoop</span>
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/dashboard" className="text-slate-400 hover:text-white">Generator</Link>
            <Link href="/stories" className="text-slate-400 hover:text-white">Stories</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-2 text-2xl font-bold text-white">Referral Links</h1>
        <p className="mb-8 text-slate-400">
          Share unique links. Track clicks and signups. Product-led growth built in.
        </p>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (e.g. Twitter, Partner)"
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={handleCreate}
            className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Create link
          </button>
        </div>

        {links.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center text-slate-400">
            No referral links yet. Create one above.
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-medium text-white">{link.label}</div>
                  <div className="mt-1 font-mono text-sm text-indigo-300">
                    /r/{link.code}
                  </div>
                  <div className="mt-2 flex gap-4 text-xs text-slate-500">
                    <span>{link.clicks} clicks</span>
                    <span>{link.signups} signups</span>
                  </div>
                </div>
                <button
                  onClick={() => copyLink(link.code)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
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
