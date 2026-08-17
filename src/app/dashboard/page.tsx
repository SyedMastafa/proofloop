"use client";

import { useState } from "react";
import Link from "next/link";
import { saveStory } from "@/lib/storage";

type Tab = "testimonial" | "case-study" | "social";

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
        body = { type: "case-study", customerName, companyName: csCompany, challenge, solution, results };
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
      companyName: activeTab === "testimonial" ? companyName : activeTab === "case-study" ? csCompany : undefined,
    });
    setSavedId(story.id);
  }

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold text-white">P</div>
            <span className="text-lg font-semibold">ProofLoop</span>
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/stories" className="text-slate-400 hover:text-white">My Stories</Link>
            <Link href="/embed" className="text-slate-400 hover:text-white">Embed</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-2 text-2xl font-bold text-white">AI Proof Generator</h1>
        <p className="mb-8 text-slate-400">Polish testimonials, generate case studies, create social posts with Gemini.</p>

        <div className="mb-8 flex gap-2 border-b border-slate-800">
          {(["testimonial", "case-study", "social"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setResult(""); setError(""); setSavedId(null); }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${
                activeTab === tab ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400"
              }`}
            >
              {tab === "testimonial" ? "Testimonial" : tab === "case-study" ? "Case Study" : "Social"}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {activeTab === "testimonial" && (
            <>
              <textarea value={rawFeedback} onChange={(e) => setRawFeedback(e.target.value)} rows={4} placeholder="Raw customer feedback..." className={inputClass} />
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name (optional)" className={inputClass} />
            </>
          )}
          {activeTab === "case-study" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer name" className={inputClass} />
                <input value={csCompany} onChange={(e) => setCsCompany(e.target.value)} placeholder="Their company" className={inputClass} />
              </div>
              <textarea value={challenge} onChange={(e) => setChallenge(e.target.value)} rows={2} placeholder="Challenge" className={inputClass} />
              <textarea value={solution} onChange={(e) => setSolution(e.target.value)} rows={2} placeholder="Solution" className={inputClass} />
              <textarea value={results} onChange={(e) => setResults(e.target.value)} rows={2} placeholder="Results" className={inputClass} />
            </>
          )}
          {activeTab === "social" && (
            <textarea value={socialContent} onChange={(e) => setSocialContent(e.target.value)} rows={6} placeholder="Paste testimonial or case study..." className={inputClass} />
          )}
          <button onClick={handleGenerate} disabled={loading} className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50">
            {loading ? "Generating..." : "Generate →"}
          </button>
        </div>

        {error && <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

        {result && (
          <div className="mt-8">
            <div className="mb-3 flex justify-between">
              <h2 className="text-lg font-semibold text-white">Result</h2>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(result)} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300">Copy</button>
                <button onClick={handleSave} className="rounded-lg border border-indigo-500/40 bg-indigo-500/20 px-3 py-1.5 text-xs text-indigo-300">{savedId ? "Saved ✓" : "Save"}</button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap rounded-xl border border-slate-700 bg-slate-900 p-5 text-sm text-slate-200">{result}</pre>
            {savedId && (
              <p className="mt-4 text-sm text-emerald-300">
                Saved! <Link href={`/p/${savedId}`} className="underline">View public page →</Link>
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
