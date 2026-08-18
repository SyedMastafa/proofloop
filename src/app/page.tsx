import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Reveal } from "@/components/reveal";
import { HeroLottie } from "@/components/hero-lottie";

const features = [
  {
    title: "AI Testimonial Polish",
    desc: "Raw feedback becomes conversion-ready testimonials in seconds — authentic, concise, metric-aware.",
    path: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z",
  },
  {
    title: "Case Study Generator",
    desc: "Challenge → Solution → Results structured case studies your sales team can use tomorrow.",
    path: "M8 4h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2zm2 4h4M10 12h4M10 16h2",
  },
  {
    title: "Public Success Pages",
    desc: "Shareable proof pages with Powered by ProofLoop branding — built-in product-led distribution.",
    path: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c2.5 3 4 6.5 4 10s-1.5 7-4 10m0-20c-2.5 3-4 6.5-4 10s1.5 7 4 10M2 12h20",
  },
  {
    title: "Embeddable Widget",
    desc: "One script tag. Drop live social proof on any marketing site or docs page.",
    path: "M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16",
  },
  {
    title: "Social Post Engine",
    desc: "LinkedIn and X posts generated from every win — ready to schedule or send to customers.",
    path: "M4 12v8h16v-8M4 12l8-8 8 8M9 21v-6h6v6",
  },
  {
    title: "Referral Tracking",
    desc: "Unique links, click and signup attribution. Customers become your growth channel.",
    path: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  },
];

const steps = [
  { n: "01", t: "Capture feedback", d: "Paste reviews, support notes, or call summaries." },
  { n: "02", t: "Generate with AI", d: "Polish testimonials, case studies, and social posts." },
  { n: "03", t: "Publish & embed", d: "Public pages, widgets, and referral links that market themselves." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-sm font-bold text-white shadow-lg shadow-indigo-500/30">
              P
            </div>
            <span className="text-[15px] font-semibold tracking-tight">ProofLoop</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-[var(--muted)] md:flex">
            <a href="#features" className="transition hover:text-[var(--foreground)]">
              Features
            </a>
            <a href="#how" className="transition hover:text-[var(--foreground)]">
              How it works
            </a>
            <Link href="/pricing" className="transition hover:text-[var(--foreground)]">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white shadow-md shadow-indigo-500/20 transition hover:opacity-90"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="orb orb-c" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% -10%, var(--hero-glow), transparent 70%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div
            className="hero-in hero-delay-1 mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium"
            style={{
              borderColor: "var(--badge-border)",
              background: "var(--badge-bg)",
              color: "var(--badge-text)",
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
            </span>
            AI-powered customer proof for SaaS
          </div>

          {/* Lottie */}
          <div className="hero-in hero-delay-2 mb-4 flex justify-center">
            <HeroLottie />
          </div>

          <h1 className="hero-in hero-delay-3 mb-6 text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-6xl sm:leading-[1.08]">
            Turn customer success
            <br />
            <span className="hero-gradient-text">into marketing machines</span>
          </h1>

          <p className="hero-in hero-delay-4 mx-auto mb-10 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            Automatically generate testimonials, case studies, embeds, and referral links from
            real customer feedback — with near-zero marketing effort.
          </p>

          <div className="hero-in hero-delay-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center rounded-xl bg-[var(--primary)] px-7 text-[15px] font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:opacity-90 hover:shadow-indigo-500/40"
            >
              Open Generator →
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-7 text-[15px] font-medium text-[var(--muted-strong)] transition hover:bg-[var(--surface-hover)]"
            >
              View pricing
            </Link>
          </div>

          <p className="hero-in hero-delay-6 mt-6 text-xs text-[var(--muted)]">
            Free plan · No credit card · Built-in product-led growth
          </p>
        </div>

        <div className="hero-in hero-delay-6 relative mx-auto mt-14 max-w-3xl px-6">
          <div className="mock-shimmer relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-indigo-500/10">
            <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              <span className="ml-3 text-xs text-[var(--muted)]">proofloop.app/dashboard</span>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
                  Raw feedback
                </p>
                <p className="text-sm leading-relaxed text-[var(--muted-strong)]">
                  “We cut onboarding time in half after switching. Support is unreal.”
                </p>
              </div>
              <div className="rounded-xl border border-indigo-500/30 bg-[var(--badge-bg)] p-4 text-left">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--primary)]">
                  AI polished
                </p>
                <p className="text-sm leading-relaxed text-[var(--foreground)]">
                  “Switching cut our onboarding time in half. The support team has been outstanding
                  at every step.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Reveal>
        <section className="border-y border-[var(--border)] bg-[var(--surface)] py-8">
          <div className="mx-auto max-w-6xl px-6">
            <p className="mb-5 text-center text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
              Built for modern SaaS teams
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm">
              {["Product-led growth", "Customer success", "Sales enablement", "Agencies"].map(
                (t) => (
                  <span key={t} className="font-medium text-[var(--muted-strong)]">
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
        </section>
      </Reveal>

      <section id="features" className="py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="mb-3 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
                Everything you need to prove value
              </h2>
              <p className="text-[var(--muted)]">
                One platform for proof creation, distribution, and referral growth.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="group h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-lg hover:shadow-indigo-500/5">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--badge-bg)] text-[var(--primary)]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={f.path} />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-[15px] font-semibold text-[var(--foreground)]">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--muted)]">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="border-t border-[var(--border)] py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              How it works
            </h2>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className="relative text-center md:text-left">
                  <div className="mb-4 text-sm font-semibold tracking-widest text-[var(--primary)]">
                    {s.n}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">{s.t}</h3>
                  <p className="text-sm text-[var(--muted)]">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Reveal>
        <section className="border-t border-[var(--border)] py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Ready to turn proof into growth?
            </h2>
            <p className="mb-8 text-[var(--muted)]">
              Join teams who automate social proof and let customers do the marketing.
            </p>
            <Link
              href="/signup"
              className="inline-flex h-12 items-center rounded-xl bg-[var(--primary)] px-8 text-[15px] font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90"
            >
              Start free →
            </Link>
          </div>
        </section>
      </Reveal>

      <footer className="border-t border-[var(--border)] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-[var(--muted)] sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--primary)] text-[10px] font-bold text-white">
              P
            </div>
            <span className="font-medium text-[var(--muted-strong)]">ProofLoop</span>
          </div>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-[var(--foreground)]">
              Pricing
            </Link>
            <Link href="/dashboard" className="hover:text-[var(--foreground)]">
              Dashboard
            </Link>
            <Link href="/embed" className="hover:text-[var(--foreground)]">
              Embed
            </Link>
          </div>
          <p>© 2026 ProofLoop</p>
        </div>
      </footer>
    </div>
  );
}
