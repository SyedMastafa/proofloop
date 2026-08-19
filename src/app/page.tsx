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
    desc: "Shareable pages with Powered by ProofLoop branding — every page markets the product.",
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
  {
    n: "01",
    t: "Capture feedback",
    d: "Paste reviews, support notes, call summaries, or NPS comments in one place.",
  },
  {
    n: "02",
    t: "Generate with AI",
    d: "Polish testimonials, build case studies, and draft social posts in seconds.",
  },
  {
    n: "03",
    t: "Publish & grow",
    d: "Public pages, embeds, and referral links that market themselves — and ProofLoop.",
  },
];

const withoutItems = [
  "Testimonials stuck in Notion and Slack",
  "Sales asks for proof — marketing is busy",
  "Case studies take weeks to ship",
  "No system for referrals or embeds",
  "Happy customers never become advocates",
];

const withItems = [
  "Proof ready the same day feedback arrives",
  "Sales gets snippets and public pages instantly",
  "Case studies in Challenge → Solution → Results",
  "Embeds + referral links out of the box",
  "Every success page markets your product",
];

const wall = [
  {
    quote:
      "We stopped chasing quotes in email threads. Paste feedback, polish with AI, publish — same afternoon.",
    name: "Aisha Rahman",
    role: "Head of Growth",
    company: "Northstar SaaS",
  },
  {
    quote:
      "Sales finally has a library of proof they trust. Case studies that used to take a month now take an hour.",
    name: "Daniel Okonkwo",
    role: "Founder",
    company: "RelayOps",
  },
  {
    quote:
      "The public pages are the underrated part. Customers share their own success story — and we get distribution.",
    name: "Sofia Mendes",
    role: "Customer Success",
    company: "Latticeflow",
  },
  {
    quote:
      "Embed took five minutes. Homepage social proof went from empty to credible without a designer.",
    name: "James Park",
    role: "Marketing Lead",
    company: "Orbitly",
  },
  {
    quote:
      "Referral links + polished testimonials in one tool. Our PLG loop finally has a proof layer.",
    name: "Priya Shah",
    role: "Product",
    company: "Stackmint",
  },
  {
    quote:
      "I generate LinkedIn posts from every case study. Customers love the draft — we just hit publish.",
    name: "Marcus Webb",
    role: "CEO",
    company: "Clearpath",
  },
];

const audiences = ["Product-led growth", "Customer success", "Sales enablement", "Agencies", "Founders"];

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
            <a href="#proof" className="transition hover:text-[var(--foreground)]">
              Social proof
            </a>
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
              className="hidden rounded-lg px-3 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)] sm:inline"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white shadow-md shadow-indigo-500/20 transition hover:opacity-90"
            >
              Start free
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
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
            The easiest way to turn feedback into social proof
          </div>

          <div className="hero-in hero-delay-2 mb-2 flex justify-center">
            <HeroLottie />
          </div>

          <h1 className="hero-in hero-delay-3 mb-6 text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-6xl sm:leading-[1.08]">
            Customer success,
            <br />
            <span className="hero-gradient-text">on autopilot</span>
          </h1>

          <p className="hero-in hero-delay-4 mx-auto mb-8 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            Collect wins from feedback. Generate testimonials, case studies, and embeds with AI.
            Share pages that market themselves — with near-zero effort.
          </p>

          <div className="hero-in hero-delay-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center rounded-xl bg-[var(--primary)] px-8 text-[15px] font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:opacity-90"
            >
              Start for free today
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-7 text-[15px] font-medium text-[var(--muted-strong)] transition hover:bg-[var(--surface-hover)]"
            >
              Try the generator
            </Link>
          </div>
          <p className="hero-in hero-delay-6 mt-5 text-xs text-[var(--muted)]">
            Free plan · No credit card · AI polish included
          </p>

          <div className="hero-in hero-delay-6 mx-auto mt-12 max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 p-5 text-left backdrop-blur">
            <p className="text-sm leading-relaxed text-[var(--muted-strong)]">
              “This is changing the game on getting social proof and making it effortless for our
              team.”
            </p>
            <p className="mt-3 text-xs font-medium text-[var(--foreground)]">
              Lex · Growth lead, B2B SaaS
            </p>
          </div>
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
              Built for teams who live on social proof
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
              {audiences.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5 font-medium text-[var(--muted-strong)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <section className="py-24 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              You without proof vs with ProofLoop
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-center text-[var(--muted)]">
              Same happy customers. Completely different growth system.
            </p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal delay={80}>
              <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
                <p className="mb-6 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Without ProofLoop
                </p>
                <ul className="space-y-4">
                  {withoutItems.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-[var(--muted-strong)]">
                      <span className="mt-0.5 text-red-400">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className="h-full rounded-2xl border border-[var(--primary)]/40 bg-[var(--badge-bg)] p-8">
                <p className="mb-6 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
                  With ProofLoop
                </p>
                <ul className="space-y-4">
                  {withItems.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-[var(--foreground)]">
                      <span className="mt-0.5 text-[var(--primary)]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="proof" className="border-t border-[var(--border)] bg-[var(--surface)] py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Teams that ship proof faster
            </h2>
            <p className="mx-auto mb-14 max-w-xl text-center text-[var(--muted)]">
              What early users say about turning feedback into marketing assets.
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wall.map((t, i) => (
              <Reveal key={t.name} delay={i * 60}>
                <figure className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
                  <blockquote className="flex-1 text-sm leading-relaxed text-[var(--muted-strong)]">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-5 border-t border-[var(--border)] pt-4">
                    <div className="font-medium text-[var(--foreground)]">{t.name}</div>
                    <div className="text-xs text-[var(--muted)]">
                      {t.role}, {t.company}
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="mb-3 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
                Your all-in-one proof engine
              </h2>
              <p className="text-[var(--muted)]">
                Generate, publish, embed, and refer — without a content team bottleneck.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
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
            <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Start collecting &amp; sharing proof in minutes
            </h2>
            <p className="mx-auto mb-14 max-w-lg text-center text-[var(--muted)]">
              Three steps. No design team. No waiting on “we’ll write the case study next quarter.”
            </p>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center md:text-left">
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
              Ready to show proof everywhere?
            </h2>
            <p className="mb-8 text-[var(--muted)]">
              Start free. Generate your first polished testimonial in under a minute.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center rounded-xl bg-[var(--primary)] px-8 text-[15px] font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90"
              >
                Start for free today
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-12 items-center rounded-xl border border-[var(--border)] px-7 text-[15px] font-medium text-[var(--muted-strong)] transition hover:bg-[var(--surface)]"
              >
                See pricing
              </Link>
            </div>
            <p className="mt-6 text-xs text-[var(--muted)]">No credit card required</p>
          </div>
        </section>
      </Reveal>

      <footer className="border-t border-[var(--border)] py-12">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--primary)] text-[10px] font-bold text-white">
                P
              </div>
              <span className="font-semibold text-[var(--foreground)]">ProofLoop</span>
            </div>
            <p className="text-sm text-[var(--muted)]">
              Automated customer proof &amp; referrals for B2B SaaS.
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Product
            </p>
            <div className="flex flex-col gap-2 text-sm text-[var(--muted-strong)]">
              <Link href="/dashboard" className="hover:text-[var(--foreground)]">
                Generator
              </Link>
              <Link href="/embed" className="hover:text-[var(--foreground)]">
                Embed
              </Link>
              <Link href="/referrals" className="hover:text-[var(--foreground)]">
                Referrals
              </Link>
              <Link href="/pricing" className="hover:text-[var(--foreground)]">
                Pricing
              </Link>
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Company
            </p>
            <div className="flex flex-col gap-2 text-sm text-[var(--muted-strong)]">
              <Link href="/signup" className="hover:text-[var(--foreground)]">
                Sign up
              </Link>
              <Link href="/login" className="hover:text-[var(--foreground)]">
                Log in
              </Link>
              <a href="mailto:support@proofloop.app" className="hover:text-[var(--foreground)]">
                Support
              </a>
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Legal
            </p>
            <div className="flex flex-col gap-2 text-sm text-[var(--muted-strong)]">
              <Link href="/privacy" className="hover:text-[var(--foreground)]">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[var(--foreground)]">
                Terms
              </Link>
              <p className="text-[var(--muted)]">© 2026 ProofLoop</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
