"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/app-header";

type Metrics = {
  storyCount: number;
  storiesLast7: number;
  typeBreakdown: Record<string, number>;
  recentStories: {
    id: string;
    title: string;
    type: string;
    created_at: string;
    user_id: string;
  }[];
  userCount: number | null;
  users: {
    id: string;
    email?: string;
    created_at: string;
    last_sign_in_at?: string | null;
  }[];
  hasServiceRole: boolean;
  adminEmail: string;
};

const presets = [
  "Write a 3-email onboarding sequence for new free users who haven't created a story yet",
  "Draft a Product Hunt launch post and 3 maker comments",
  "Write 3 LinkedIn posts about AI testimonials vs manual case studies",
  "Cold outreach email to Head of CS at a 20-person B2B SaaS",
  "Reply to: 'How are you different from Senja?'",
];

export default function AdminPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  const [goal, setGoal] = useState(presets[0]);
  const [context, setContext] = useState("");
  const [agentOut, setAgentOut] = useState("");
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentError, setAgentError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/metrics");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Forbidden");
        setMetrics(data);
      } catch (e: unknown) {
        setLoadError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function runAgent() {
    setAgentLoading(true);
    setAgentError("");
    setAgentOut("");
    try {
      const res = await fetch("/api/admin/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setAgentOut(data.result);
    } catch (e: unknown) {
      setAgentError(e instanceof Error ? e.message : "Agent error");
    } finally {
      setAgentLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <AppHeader
        links={[
          { href: "/admin", label: "Admin" },
          { href: "/dashboard", label: "Generator" },
          { href: "/stories", label: "Stories" },
          { href: "/pricing", label: "Pricing" },
        ]}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--primary)]">
            Phase 1
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Admin dashboard</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Metrics + AI sales agent (draft only — no auto-send).
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)]/30 border-t-[var(--primary)]" />
          </div>
        )}

        {loadError && (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm">
            <p className="font-medium text-amber-700 dark:text-amber-400">{loadError}</p>
            <p className="mt-2 text-[var(--muted)]">
              Log in with an email listed in <code className="text-xs">ADMIN_EMAILS</code> on
              Vercel, then redeploy. Example:{" "}
              <code className="text-xs">ADMIN_EMAILS=you@company.com</code>
            </p>
            <Link href="/login" className="mt-4 inline-block text-[var(--primary)] underline">
              Go to login →
            </Link>
          </div>
        )}

        {metrics && (
          <>
            {/* KPI cards */}
            <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Stories total", value: metrics.storyCount },
                { label: "Stories (7d)", value: metrics.storiesLast7 },
                {
                  label: "Users",
                  value:
                    metrics.userCount === null
                      ? "—"
                      : metrics.userCount >= 50
                      ? `${metrics.userCount}+`
                      : metrics.userCount,
                },
                {
                  label: "Admin",
                  value: metrics.adminEmail?.split("@")[0] || "—",
                },
              ].map((k) => (
                <div
                  key={k.label}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-4"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                    {k.label}
                  </p>
                  <p className="mt-1 truncate text-2xl font-bold text-[var(--foreground)]">
                    {k.value}
                  </p>
                </div>
              ))}
            </div>

            {!metrics.hasServiceRole && (
              <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs text-[var(--muted)]">
                Add <code>SUPABASE_SERVICE_ROLE_KEY</code> in Vercel for full user list (server
                only). Story metrics still work without it.
              </div>
            )}

            <div className="mb-10 grid gap-6 lg:grid-cols-2">
              {/* Type breakdown */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <h2 className="mb-4 text-sm font-semibold">Story types</h2>
                <ul className="space-y-2 text-sm">
                  {Object.keys(metrics.typeBreakdown).length === 0 && (
                    <li className="text-[var(--muted)]">No stories yet</li>
                  )}
                  {Object.entries(metrics.typeBreakdown).map(([t, n]) => (
                    <li key={t} className="flex justify-between">
                      <span className="capitalize text-[var(--muted-strong)]">
                        {t.replace("-", " ")}
                      </span>
                      <span className="font-medium">{n}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent stories */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <h2 className="mb-4 text-sm font-semibold">Recent stories</h2>
                <ul className="max-h-64 space-y-3 overflow-y-auto text-sm">
                  {metrics.recentStories.length === 0 && (
                    <li className="text-[var(--muted)]">None yet</li>
                  )}
                  {metrics.recentStories.map((s) => (
                    <li key={s.id} className="border-b border-[var(--border)] pb-2 last:border-0">
                      <Link
                        href={`/p/${s.id}`}
                        className="font-medium text-[var(--foreground)] hover:text-[var(--primary)]"
                      >
                        {s.title}
                      </Link>
                      <p className="text-xs text-[var(--muted)]">
                        {s.type} · {new Date(s.created_at).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Users table */}
            <div className="mb-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h2 className="mb-4 text-sm font-semibold">Users (latest page)</h2>
              {metrics.users.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">
                  {metrics.hasServiceRole
                    ? "No users found."
                    : "Set SUPABASE_SERVICE_ROLE_KEY to load auth users."}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-xs text-[var(--muted)]">
                        <th className="pb-2 pr-4 font-medium">Email</th>
                        <th className="pb-2 pr-4 font-medium">Created</th>
                        <th className="pb-2 font-medium">Last sign-in</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.users.map((u) => (
                        <tr key={u.id} className="border-b border-[var(--border)]/60">
                          <td className="py-2.5 pr-4 text-[var(--foreground)]">
                            {u.email || u.id.slice(0, 8)}
                          </td>
                          <td className="py-2.5 pr-4 text-[var(--muted)]">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-2.5 text-[var(--muted)]">
                            {u.last_sign_in_at
                              ? new Date(u.last_sign_in_at).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* AI Agent */}
            <div className="rounded-2xl border border-[var(--primary)]/30 bg-[var(--card)] p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">AI sales agent</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Drafts only. Copy what you need — nothing is sent automatically.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setGoal(p)}
                    className={`rounded-full border px-3 py-1 text-left text-xs ${
                      goal === p
                        ? "border-[var(--primary)] bg-[var(--badge-bg)] text-[var(--primary)]"
                        : "border-[var(--border)] text-[var(--muted)]"
                    }`}
                  >
                    {p.slice(0, 42)}…
                  </button>
                ))}
              </div>

              <label className="mt-5 block text-xs font-medium text-[var(--muted)]">Goal</label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={3}
                className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
              />

              <label className="mt-4 block text-xs font-medium text-[var(--muted)]">
                Extra context (optional)
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={2}
                placeholder="ICP, tone, upcoming launch date…"
                className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
              />

              <button
                type="button"
                onClick={runAgent}
                disabled={agentLoading}
                className="mt-4 inline-flex h-11 items-center rounded-xl bg-[var(--primary)] px-6 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                {agentLoading ? "Agent thinking…" : "Generate drafts →"}
              </button>

              {agentError && (
                <p className="mt-3 text-sm text-red-500">{agentError}</p>
              )}

              {agentOut && (
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Output</h3>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(agentOut)}
                      className="text-xs text-[var(--primary)] hover:underline"
                    >
                      Copy all
                    </button>
                  </div>
                  <pre className="max-h-[480px] overflow-y-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm leading-relaxed text-[var(--foreground)]">
                    {agentOut}
                  </pre>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
