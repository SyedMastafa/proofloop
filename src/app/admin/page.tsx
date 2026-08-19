"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/app-header";

type Metrics = {
  storyCount: number;
  storiesLast7: number;
  typeBreakdown: Record<string, number>;
  recentStories: { id: string; title: string; type: string; created_at: string }[];
  userCount: number | null;
  users: { id: string; email?: string; created_at: string; last_sign_in_at?: string | null }[];
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
};

type Task = {
  id: string;
  status: string;
  subject: string | null;
  body: string;
  to_email: string | null;
  error: string | null;
  created_at: string;
};

type Sequence = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  sequence_steps?: { step_order: number; delay_days: number; subject: string }[];
};

type Enrollment = {
  id: string;
  status: string;
  current_step: number;
  next_run_at: string;
  leads?: { email: string } | null;
};

type Campaign = {
  id: string;
  title: string;
  channel: string;
  body: string;
  status: string;
  created_at: string;
};

type Tab =
  | "overview"
  | "leads"
  | "queue"
  | "sequences"
  | "campaigns"
  | "agent";

const presets = [
  "Write a 3-email onboarding sequence for new free users who haven't created a story yet",
  "Draft a Product Hunt launch post and 3 maker comments",
  "Write 3 LinkedIn posts about AI testimonials vs manual case studies",
  "Cold outreach email to Head of CS at a 20-person B2B SaaS",
  "Reply to: 'How are you different from Senja?'",
];

const STAGES = ["new", "nurture", "qualified", "won", "lost"] as const;

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [warning, setWarning] = useState("");
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
      setLoadError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLeads = useCallback(async () => {
    const res = await fetch("/api/admin/leads");
    const data = await res.json();
    if (res.ok) {
      setLeads(data.leads || []);
      setWarning(data.warning || "");
    }
  }, []);

  const loadTasks = useCallback(async () => {
    const res = await fetch("/api/admin/tasks");
    const data = await res.json();
    if (res.ok) setTasks(data.tasks || []);
  }, []);

  const loadSequences = useCallback(async () => {
    const res = await fetch("/api/admin/sequences");
    const data = await res.json();
    if (res.ok) {
      setSequences(data.sequences || []);
      setEnrollments(data.enrollments || []);
      setWarning(data.warning || "");
    }
  }, []);

  const loadCampaigns = useCallback(async () => {
    const res = await fetch("/api/admin/campaigns");
    const data = await res.json();
    if (res.ok) {
      setCampaigns(data.campaigns || []);
      setWarning(data.warning || "");
    }
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  useEffect(() => {
    if (tab === "leads") loadLeads();
    if (tab === "queue") loadTasks();
    if (tab === "sequences") loadSequences();
    if (tab === "campaigns") loadCampaigns();
  }, [tab, loadLeads, loadTasks, loadSequences, loadCampaigns]);

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
      setAgentError(e instanceof Error ? e.message : "Error");
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
      if (!res.ok) throw new Error(data.error || "Failed");
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

  async function seqAction(payload: Record<string, unknown>) {
    setBusyId(String(payload.sequenceId || payload.leadId || payload.enrollmentId || "x"));
    try {
      const res = await fetch("/api/admin/sequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      await loadSequences();
      if (payload.action === "set_lead_stage") await loadLeads();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusyId(null);
    }
  }

  async function campaignAction(payload: Record<string, unknown>) {
    setBusyId("camp");
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      await loadCampaigns();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusyId(null);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "leads", label: "Leads" },
    { id: "queue", label: "Queue" },
    { id: "sequences", label: "Sequences" },
    { id: "campaigns", label: "Campaigns" },
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
            Phase 3 + 4 ready
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Admin dashboard</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Sequences (cron), campaigns, CRM stages, approve queue, AI agent.
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

        {loadError && (
          <div className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm">
            <p className="font-medium text-amber-700 dark:text-amber-400">{loadError}</p>
            <Link href="/login" className="mt-3 inline-block text-[var(--primary)] underline">
              Login →
            </Link>
          </div>
        )}

        {warning && (
          <p className="mb-4 text-xs text-amber-600">{warning}</p>
        )}

        {loading && tab === "overview" && (
          <div className="flex justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)]/30 border-t-[var(--primary)]" />
          </div>
        )}

        {metrics && tab === "overview" && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Stories", value: metrics.storyCount },
              { label: "Stories 7d", value: metrics.storiesLast7 },
              {
                label: "Users",
                value: metrics.userCount ?? "—",
              },
              { label: "Admin", value: metrics.adminEmail?.split("@")[0] },
            ].map((k) => (
              <div
                key={k.label}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-4"
              >
                <p className="text-xs uppercase tracking-wider text-[var(--muted)]">{k.label}</p>
                <p className="mt-1 text-2xl font-bold">{k.value}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "leads" && (
          <div className="space-y-3">
            {leads.length === 0 && (
              <p className="text-sm text-[var(--muted)]">No leads yet. Need schema + service role + events.</p>
            )}
            {leads.map((l) => (
              <div
                key={l.id}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{l.email}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {l.score} pts · {l.temperature} · {l.stage}
                    {l.last_event ? ` · ${l.last_event}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-xs"
                    value={l.stage}
                    onChange={(e) =>
                      seqAction({
                        action: "set_lead_stage",
                        leadId: l.id,
                        stage: e.target.value,
                      })
                    }
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={busyId === l.id}
                    onClick={() => draftForLead(l.id)}
                    className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Draft email
                  </button>
                  {sequences[0] && (
                    <button
                      type="button"
                      onClick={() =>
                        seqAction({
                          action: "enroll",
                          sequenceId: sequences[0].id,
                          leadId: l.id,
                        })
                      }
                      className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs"
                    >
                      Enroll sequence
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "queue" && (
          <div className="space-y-4">
            {tasks.length === 0 && (
              <p className="text-sm text-[var(--muted)]">Empty queue. Draft from Leads.</p>
            )}
            {tasks.map((t) => (
              <div key={t.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                <p className="text-xs text-[var(--muted)]">
                  {t.status} · {t.to_email}
                </p>
                <p className="font-medium">{t.subject}</p>
                <pre className="mt-2 max-h-32 overflow-y-auto whitespace-pre-wrap text-xs text-[var(--muted-strong)]">
                  {t.body}
                </pre>
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.status === "draft" && (
                    <>
                      <button
                        type="button"
                        onClick={() => taskAction(t.id, "set_status", "approved")}
                        className="rounded-lg border border-[var(--primary)]/40 px-3 py-1 text-xs text-[var(--primary)]"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => taskAction(t.id, "set_status", "rejected")}
                        className="rounded-lg border px-3 py-1 text-xs"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {(t.status === "draft" || t.status === "approved") && (
                    <button
                      type="button"
                      onClick={() => taskAction(t.id, "send")}
                      className="rounded-lg bg-[var(--primary)] px-3 py-1 text-xs text-white"
                    >
                      Send
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "sequences" && (
          <div className="space-y-6">
            <p className="text-sm text-[var(--muted)]">
              Phase 3: drip emails via hourly cron <code className="text-xs">/api/cron/sequences</code>.
              Activate only when Resend + CRON_SECRET are set.
            </p>
            {sequences.map((s) => (
              <div key={s.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{s.name}</h3>
                    <p className="text-xs text-[var(--muted)]">{s.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      seqAction({
                        action: "toggle_active",
                        sequenceId: s.id,
                        is_active: !s.is_active,
                      })
                    }
                    className={`rounded-full px-4 py-1.5 text-xs font-medium ${
                      s.is_active
                        ? "bg-emerald-500/15 text-emerald-600"
                        : "bg-[var(--surface)] text-[var(--muted)]"
                    }`}
                  >
                    {s.is_active ? "Active" : "Inactive"}
                  </button>
                </div>
                <ul className="mt-4 space-y-1 text-xs text-[var(--muted-strong)]">
                  {(s.sequence_steps || [])
                    .sort((a, b) => a.step_order - b.step_order)
                    .map((st) => (
                      <li key={st.step_order}>
                        Day +{st.delay_days}: {st.subject}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="mb-3 text-sm font-semibold">Enrollments</h3>
              {enrollments.length === 0 && (
                <p className="text-xs text-[var(--muted)]">None. Enroll from Leads tab.</p>
              )}
              {enrollments.map((e) => (
                <div
                  key={e.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] py-2 text-sm last:border-0"
                >
                  <span>
                    {e.leads?.email || "—"} · step {e.current_step} · {e.status}
                  </span>
                  {e.status === "active" && (
                    <button
                      type="button"
                      className="text-xs text-[var(--muted)] underline"
                      onClick={() =>
                        seqAction({
                          action: "set_enrollment_status",
                          enrollmentId: e.id,
                          status: "paused",
                        })
                      }
                    >
                      Pause
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "campaigns" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busyId === "camp"}
                onClick={() => campaignAction({ action: "generate_weekly" })}
                className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {busyId === "camp" ? "Generating…" : "Generate weekly posts"}
              </button>
            </div>
            <p className="text-xs text-[var(--muted)]">
              Phase 4: AI ideas for X/LinkedIn. Mark published after you post manually.
            </p>
            {campaigns.length === 0 && (
              <p className="text-sm text-[var(--muted)]">No campaigns yet.</p>
            )}
            {campaigns.map((c) => (
              <div key={c.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-[var(--badge-bg)] px-2 py-0.5 text-[var(--primary)]">
                    {c.channel}
                  </span>
                  <span className="text-[var(--muted)]">{c.status}</span>
                </div>
                <p className="font-medium">{c.title}</p>
                <pre className="mt-2 max-h-36 overflow-y-auto whitespace-pre-wrap text-xs text-[var(--muted-strong)]">
                  {c.body}
                </pre>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(c.body)}
                    className="rounded-lg border px-3 py-1 text-xs"
                  >
                    Copy
                  </button>
                  {c.status !== "published" && (
                    <button
                      type="button"
                      onClick={() =>
                        campaignAction({
                          action: "set_status",
                          campaignId: c.id,
                          status: "published",
                        })
                      }
                      className="rounded-lg bg-[var(--primary)] px-3 py-1 text-xs text-white"
                    >
                      Mark published
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "agent" && (
          <div className="rounded-2xl border border-[var(--primary)]/30 bg-[var(--card)] p-5">
            <h2 className="font-semibold">AI agent</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setGoal(p)}
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]"
                >
                  {p.slice(0, 36)}…
                </button>
              ))}
            </div>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
              className="mt-4 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            />
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={2}
              placeholder="Context…"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={runAgent}
              disabled={agentLoading}
              className="mt-3 rounded-xl bg-[var(--primary)] px-5 py-2 text-sm font-medium text-white"
            >
              {agentLoading ? "…" : "Generate"}
            </button>
            {agentError && <p className="mt-2 text-sm text-red-500">{agentError}</p>}
            {agentOut && (
              <pre className="mt-4 max-h-96 overflow-y-auto whitespace-pre-wrap text-sm">{agentOut}</pre>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
