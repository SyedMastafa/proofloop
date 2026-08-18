"use client";

import { useState } from "react";
import Link from "next/link";
import { saveStory } from "@/lib/storage";
import { AppHeader } from "@/components/app-header";

type Tab = "testimonial" | "case-study" | "social";

const tabs: { id: Tab; label: string; hint: string }[] = [
  { id: "testimonial", label: "Testimonial", hint: "Polish raw feedback into a quote sales can use" },
  { id: "case-study", label: "Case study", hint: "Structure Challenge → Solution → Results" },
  { id: "social", label: "Social posts", hint: "Turn a win into LinkedIn & X drafts" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("testimonial");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);

  const [rawFeedback, setRawFeedback] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [csCompany, setCsCompany] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [results, setResults] = useState("");
  const [socialContent, setSocialContent] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setResult("");
    setSavedId(null);
    try {
      let body: Record<string, string> = { type: activeTab };
      if (activeTab === "testimonial") {
        body.rawFeedback = rawFeedback;
        body.companyName = companyName;
      } else if (activeTab === "case-study") {
        body = {
          type: "case-study",
          customerName,
          companyName: csCompany,
          challenge,
          solution,
          results,
        };
      } else {
        body.content = socialContent;
      }
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!result) return;
    const title =
      activeTab === "testimonial"
        ? `Testimonial${companyName ? ` – ${companyName}` : ""}`
        : activeTab === "case-study"
        ? `Case Study – ${csCompany || customerName || "Untitled"}`
        : "Social Posts";
    const story = saveStory({
      type: activeTab,
      title,
      content: result,
      customerName: activeTab === "case-study" ? customerName : undefined,
      companyName:
        activeTab === "testimonial"
          ? companyName
          : activeTab === "case-study"
          ? csCompany
          : undefined,
    });
    setSavedId(story.id);
  }

  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20";

  const activeHint = tabs.find((t) => t.id === activeTab)?.hint;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <AppHeader
        links={[
          { href: "/dashboard", label: "Generator" },
          { href: "/stories", label: "Stories" },
          { href: "/embed", label: "Embed" },
          { href: "/referrals", label: "Referrals" },
          { href: "/pricing", label: "Pricing" },
        ]}
      />

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Page intro */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
              AI Proof Generator
            </h1>
            <p className="mt-1 text-[var(--muted)]">
              Turn raw feedback into assets your sales and marketing team can ship today.
            </p>
          </div>
          <Link
            href="/stories"
            className="inline-flex h-10 items-center rounded-xl border border-[var(--border)] px-4 text-sm font-medium text-[var(--muted-strong)] hover:bg-[var(--surface)]"
          >
            View stories →
          </Link>
        </div>

        {/* Quick tips */}
        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          {[
            { t: "Paste real words", d: "Support notes & call snippets work best" },
            { t: "Add metrics", d: "Numbers make testimonials convert" },
            { t: "Save & share", d: "Public page + embed in one click" },
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

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Input panel */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="mb-6 flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setResult("");
                      setError("");
                      setSavedId(null);
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      activeTab === tab.id
                        ? "bg-[var(--primary)] text-white"
                        : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <p className="mb-4 text-sm text-[var(--muted)]">{activeHint}</p>

              <div className="space-y-4">
                {activeTab === "testimonial" && (
                  <>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                        Raw feedback
                      </label>
                      <textarea
                        value={rawFeedback}
                        onChange={(e) => setRawFeedback(e.target.value)}
                        rows={5}
                        placeholder="Paste what the customer said…"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                        Company (optional)
                      </label>
                      <input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Acme Inc."
                        className={inputClass}
                      />
                    </div>
                  </>
                )}
                {activeTab === "case-study" && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                          Customer name
                        </label>
                        <input
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Jane Doe"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                          Their company
                        </label>
                        <input
                          value={csCompany}
                          onChange={(e) => setCsCompany(e.target.value)}
                          placeholder="Acme Inc."
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                        Challenge
                      </label>
                      <textarea
                        value={challenge}
                        onChange={(e) => setChallenge(e.target.value)}
                        rows={2}
                        placeholder="What problem did they face?"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                        Solution
                      </label>
                      <textarea
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        rows={2}
                        placeholder="How did you help?"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                        Results
                      </label>
                      <textarea
                        value={results}
                        onChange={(e) => setResults(e.target.value)}
                        rows={2}
                        placeholder="Metrics, outcomes…"
                        className={inputClass}
                      />
                    </div>
                  </>
                )}
                {activeTab === "social" && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
                      Source content
                    </label>
                    <textarea
                      value={socialContent}
                      onChange={(e) => setSocialContent(e.target.value)}
                      rows={7}
                      placeholder="Paste a testimonial or case study…"
                      className={inputClass}
                    />
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 sm:w-auto sm:px-8"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Generating…
                    </span>
                  ) : (
                    "Generate with AI →"
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Output panel */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[var(--foreground)]">Output</h2>
                {result && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(result)}
                      className="rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--muted)] hover:bg-[var(--surface)]"
                    >
                      Copy
                    </button>
                    <button
                      onClick={handleSave}
                      className="rounded-lg border border-[var(--primary)]/40 bg-[var(--badge-bg)] px-2.5 py-1 text-xs text-[var(--primary)]"
                    >
                      {savedId ? "Saved ✓" : "Save"}
                    </button>
                  </div>
                )}
              </div>

              {!result && !loading && (
                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 text-center">
                  <p className="text-sm font-medium text-[var(--muted-strong)]">No output yet</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Fill the form and generate — result appears here.
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex min-h-[220px] flex-col items-center justify-center gap-3">
                  <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)]/30 border-t-[var(--primary)]" />
                  <p className="text-sm text-[var(--muted)]">Gemini is polishing…</p>
                </div>
              )}

              {result && !loading && (
                <>
                  <pre className="max-h-[420px] overflow-y-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm leading-relaxed text-[var(--foreground)]">
                    {result}
                  </pre>
                  {savedId && (
                    <p className="mt-4 text-sm text-emerald-600">
                      Saved!{" "}
                      <Link href={`/p/${savedId}`} className="font-medium underline">
                        Open public page →
                      </Link>
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
