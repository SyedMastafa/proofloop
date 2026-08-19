"use client";

import { useCallback, useEffect, useState } from "react";
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

type Lead = {
  id: string;
  email: string;
  score: number;
  temperature: string;
  stage: string;
  last_event: string | null;
  last_seen_at: string;
  created_at: string;
};

type Task = {
  id: string;
  lead_id: string | null;
  type: string;
  status: string;
  subject: string | null;
  body: string;
  to_email: string | null;
  error: string | null;
  created_at: string;
  sent_at: string | null;
};

type Tab = "overview" | "leads" | "queue" | "agent";

const presets = [
  "Write a 3-email onboarding sequence for new free users who haven't created a story yet",
  "Draft a Product Hunt launch post and 3 maker comments",
  "Write 3 LinkedIn posts about AI testimonials vs manual case studies",
  "Cold outreach email to Head of CS at a 20-person B2B SaaS",
  "Reply to: 'How are you different from Senja?'",
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leadsWarning, setLeadsWarning] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const [goal, setGoal] = useState(presets[0]);
  const [context, setContext] = useState("");
  const [agentOut, setAgentOut] = useState("");
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentError, setAgentError] = useState("");

  const loadMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/metrics");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Forbidden");
      setMetrics(data);
      setLoadError("");
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLeads = useCallback(async () => {
    const res = await fetch("/api/admin/leads");
    const data = await res.json();
    if (res.ok) {
      setLeads(data.leads || []);
      setLeadsWarning(data.warning || "");
    }
  }, []);

  const loadTasks = useCallback(async () => {
    const res = await fetch("/api/admin/tasks");
    const data = await res.json();
    if (res.ok) setTasks(data.tasks || []);
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  useEffect(() => {
    if (tab === "leads") loadLeads();
    if (tab === "queue") loadTasks();
  }, [tab, loadLeads, loadTasks]);

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

  async function draftForLead(leadId: string) {
    setBusyId(leadId);
    try {
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "draft_for_lead", leadId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Draft failed");
      setTab("queue");
      await loadTasks();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusyId(null);
    }
  }

  async function taskAction(taskId: string, action: string, status?: string) {
    setBusyId(taskId);
    try {
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          action === "send"
            ? { action: "send", taskId }
            : { action: "set_status", taskId, status }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      await loadTasks();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusyId(null);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "leads", label: "Leads" },
    { id: "queue", label: "Approve queue" },
    { id: "agent", label: "Agent" },
  ];

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
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--primary)]">
            Phase 2
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Admin dashboard</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Leads, scoring, approve-to-send queue, AI drafts.
          </p>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
                tab === t.id
                  ? "bg-[var(--primary)] text-white"
                  : "border border-[var(--border)] text-[var(--muted)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading && tab === "overview" && (
          <div className="flex justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)]/30 border-t-[var(--primary)]" />
          </div>
        )}

        {loadError && (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm">
            <p className="font-medium text-amber-700 dark:text-amber-400">{loadError}</p>
            <p className="mt-2 text-[var(--muted)]">
              Set <code className="text-xs">ADMIN_EMAILS</code> to your login email on Vercel.
            </p>
            <Link href="/login" className="mt-4 inline-block text-[var(--primary)] underline">
              Go to login →
            </Link>
          </div>
        )}

        {/* OVERVIEW */}
        {metrics && tab === "overview" && (
          <>
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
                { label: "Admin", value: metrics.adminEmail?.split("@")[0] || "—" },
              ].map((k) => (
                <div
                  key={k.label}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-4"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                    {k.label}
                  </p>
                  <p className="mt-1 truncate text-2xl font-bold">{k.value}</p>
                </div>
              ))}
            </div>

            {!metrics.hasServiceRole && (
              <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs text-[var(--muted)]">
                Add <code>SUPABASE_SERVICE_ROLE_KEY</code> for users, leads, and queue.
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <h2 className="mb-4 text-sm font-semibold">Story types</h2>
                <ul className="space-y-2 text-sm">
                  {Object.entries(metrics.typeBreakdown).map(([t, n]) => (
                    <li key={t} className="flex justify-between">
                      <span className="capitalize">{t.replace("-", " ")}</span>
                      <span className="font-medium">{n}</span>
                    </li>
                  ))}
                  {Object.keys(metrics.typeBreakdown).length === 0 && (
                    <li className="text-[var(--muted)]">No stories</li>
                  )}
                </ul>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <h2 className="mb-4 text-sm font-semibold">Recent stories</h2>
                <ul className="max-h-64 space-y-3 overflow-y-auto text-sm">
                  {metrics.recentStories.map((s) => (
                    <li key={s.id}>
                      <Link href={`/p/${s.id}`} className="font-medium hover:text-[var(--primary)]">
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
          </>
        )}

        {/* LEADS */}
        {tab === "leads" && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5">
            <h2 className="mb-4 text-sm font-semibold">Leads by score</h2>
            {leadsWarning && (
              <p className="mb-3 text-xs text-amber-600">{leadsWarning}</p>
            )}
            {leads.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">
                No leads yet. Events create leads when service role is set. Browse pricing or save
                a story while logged in.
              </p>
            ) : (
              <div className="space-y-3">
                {leads.map((l) => (
                  <div
                    key={l.id}
                    className="flex flex-col gap-3 rounded-xl border border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{l.email}</p>
                      <p className="text-xs text-[var(--muted)]">
                        Score {l.score} · {l.temperature} · {l.stage}
                        {l.last_event ? ` · last: ${l.last_event}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={busyId === l.id}
                      onClick={() => draftForLead(l.id)}
                      className="h-10 shrink-0 rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white disabled:opacity-50"
                    >
                      {busyId === l.id ? "Drafting…" : "Draft email"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* QUEUE */}
        {tab === "queue" && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--muted)]">
              Approve then Send (needs <code className="text-xs">RESEND_API_KEY</code>). Or copy
              body and send manually.
            </p>
            {tasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-sm text-[var(--muted)]">
                No tasks. Create drafts from the Leads tab.
              </div>
            ) : (
              tasks.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        t.status === "sent"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : t.status === "failed"
                          ? "bg-red-500/15 text-red-500"
                          : t.status === "approved"
                          ? "bg-[var(--badge-bg)] text-[var(--primary)]"
                          : "bg-[var(--surface)] text-[var(--muted)]"
                      }`}
                    >
                      {t.status}
                    </span>
                    <span className="text-xs text-[var(--muted)]">{t.to_email}</span>
                  </div>
                  <p className="font-medium">{t.subject || "(no subject)"}</p>
                  <pre className="mt-3 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-xl bg-[var(--background)] p-3 text-xs text-[var(--muted-strong)]">
                    {t.body}
                  </pre>
                  {t.error && (
                    <p className="mt-2 text-xs text-red-500">{t.error}</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {t.status === "draft" && (
                      <>
                        <button
                          type="button"
                          disabled={busyId === t.id}
                          onClick={() => taskAction(t.id, "set_status", "approved")}
                          className="rounded-lg border border-[var(--primary)]/40 px-3 py-1.5 text-xs text-[var(--primary)]"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={busyId === t.id}
                          onClick={() => taskAction(t.id, "set_status", "rejected")}
                          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)]"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {(t.status === "approved" || t.status === "draft") && (
                      <button
                        type="button"
                        disabled={busyId === t.id}
                        onClick={() => taskAction(t.id, "send")}
                        className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white"
                      >
                        {busyId === t.id ? "…" : "Send via Resend"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `Subject: ${t.subject}\n\n${t.body}`
                        )
                      }
                      className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)]"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* AGENT */}
        {tab === "agent" && (
          <div className="rounded-2xl border border-[var(--primary)]/30 bg-[var(--card)] p-5 sm:p-6">
            <h2 className="text-lg font-semibold">AI sales agent</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Freeform drafts (not tied to a lead). For lead-specific mail use Leads → Draft email.
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
                  {p.slice(0, 40)}…
                </button>
              ))}
            </div>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
              className="mt-4 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm"
            />
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={2}
              placeholder="Extra context…"
              className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm"
            />
            <button
              type="button"
              onClick={runAgent}
              disabled={agentLoading}
              className="mt-4 h-11 rounded-xl bg-[var(--primary)] px-6 text-sm font-semibold text-white disabled:opacity-50"
            >
              {agentLoading ? "Thinking…" : "Generate →"}
            </button>
            {agentError && <p className="mt-2 text-sm text-red-500">{agentError}</p>}
            {agentOut && (
              <pre className="mt-4 max-h-[480px] overflow-y-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm">
                {agentOut}
              </pre>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
