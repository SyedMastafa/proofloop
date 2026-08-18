import Link from "next/link";

const features = [
  {
    title: "AI Testimonial Polish",
    desc: "Raw feedback becomes conversion-ready testimonials in seconds — authentic, concise, metric-aware.",
    icon: "✨",
  },
  {
    title: "Case Study Generator",
    desc: "Challenge → Solution → Results structured case studies your sales team can use tomorrow.",
    icon: "📄",
  },
  {
    title: "Public Success Pages",
    desc: "Shareable proof pages with Powered by ProofLoop branding — built-in product-led distribution.",
    icon: "🌐",
  },
  {
    title: "Embeddable Widget",
    desc: "One script tag. Drop live social proof on any marketing site or docs page.",
    icon: "🧩",
  },
  {
    title: "Social Post Engine",
    desc: "LinkedIn and X posts generated from every win — ready to schedule or send to customers.",
    icon: "📱",
  },
  {
    title: "Referral Tracking",
    desc: "Unique links, click and signup attribution. Customers become your growth channel.",
    icon: "🔗",
  },
];

const steps = [
  { n: "01", t: "Capture feedback", d: "Paste reviews, support notes, or call summaries." },
  { n: "02", t: "Generate with AI", d: "Polish testimonials, case studies, and social posts." },
  { n: "03", t: "Publish & embed", d: "Public pages, widgets, and referral links that market themselves." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#030712]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/30">
              P
            </div>
            <span className="text-[15px] font-semibold tracking-tight">ProofLoop</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#how" className="transition hover:text-white">How it works</a>
            <Link href="/pricing" className="transition hover:text-white">Pricing</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:text-white">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-400"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.22),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(34,211,238,0.06),transparent_40%)]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-400" />
            </span>
            AI-powered customer proof for SaaS
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl sm:leading-[1.08]">
            Turn customer success
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              into marketing machines
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Automatically generate testimonials, case studies, embeds, and referral links from
            real customer feedback — with near-zero marketing effort.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center rounded-xl bg-indigo-500 px-7 text-[15px] font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400"
            >
              Open Generator →
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center rounded-xl border border-white/10 bg-white/[0.03] px-7 text-[15px] font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              View pricing
            </Link>
          </div>
          <p className="mt-6 text-xs text-slate-500">Free plan · No credit card · Built-in product-led growth</p>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-white/[0.05] bg-white/[0.015] py-8">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-5 text-center text-xs font-medium uppercase tracking-widest text-slate-500">
            Built for modern SaaS teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-slate-500">
            {["Product-led growth", "Customer success", "Sales enablement", "Agencies"].map((t) => (
              <span key={t} className="font-medium text-slate-400">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to prove value
            </h2>
            <p className="text-slate-400">
              One platform for proof creation, distribution, and referral growth.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition hover:border-indigo-500/30 hover:bg-white/[0.04]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg">
                  {f.icon}
                </div>
                <h3 className="mb-2 text-[15px] font-semibold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-white/[0.05] py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How it works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="relative text-center md:text-left">
                <div className="mb-4 text-sm font-semibold tracking-widest text-indigo-400">{s.n}</div>
                <h3 className="mb-2 text-lg font-semibold text-white">{s.t}</h3>
                <p className="text-sm text-slate-400">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-white/[0.05] py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to turn proof into growth?
          </h2>
          <p className="mb-8 text-slate-400">
            Join teams who automate social proof and let customers do the marketing.
          </p>
          <Link
            href="/signup"
            className="inline-flex h-12 items-center rounded-xl bg-indigo-500 px-8 text-[15px] font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400"
          >
            Start free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500 text-[10px] font-bold text-white">
              P
            </div>
            <span className="font-medium text-slate-400">ProofLoop</span>
          </div>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-slate-300">Pricing</Link>
            <Link href="/dashboard" className="hover:text-slate-300">Dashboard</Link>
            <Link href="/embed" className="hover:text-slate-300">Embed</Link>
          </div>
          <p>© 2026 ProofLoop</p>
        </div>
      </footer>
    </div>
  );
}
