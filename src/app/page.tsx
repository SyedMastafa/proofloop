import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold text-white">P</div>
            <span className="text-lg font-semibold tracking-tight">ProofLoop</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:text-white">Log in</Link>
            <Link href="/signup" className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400">Get started free</Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            AI-powered customer proof platform
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Turn customer success
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              into marketing machines
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400">
            Automatically generate testimonials, case studies, and referral links from customer feedback — with almost zero effort.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard" className="rounded-xl bg-indigo-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-400">
              Open Generator →
            </Link>
            <Link href="/embed" className="rounded-xl border border-slate-700 bg-slate-900/50 px-8 py-3.5 text-base font-medium text-slate-300 hover:border-slate-600">
              Embed Widget
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">Everything you need</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "AI Testimonial Polish", desc: "Raw feedback → polished testimonials with Gemini.", icon: "✨" },
              { title: "Case Study Generator", desc: "Challenge → Solution → Results in seconds.", icon: "📄" },
              { title: "Public Success Pages", desc: "Shareable pages with Powered by ProofLoop branding.", icon: "🌐" },
              { title: "Embeddable Widget", desc: "Drop testimonials on any site with one script tag.", icon: "🧩" },
              { title: "Social Posts", desc: "LinkedIn & X posts from every success story.", icon: "📱" },
              { title: "Save & Share", desc: "Store stories and get public links instantly.", icon: "🔗" },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <div className="mb-4 text-3xl">{f.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/60 py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-500 text-xs font-bold text-white">P</div>
            <span>ProofLoop</span>
          </div>
          <p>© 2026 ProofLoop</p>
        </div>
      </footer>
    </div>
  );
}
