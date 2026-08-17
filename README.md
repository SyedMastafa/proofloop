# ProofLoop

AI-powered Customer Proof & Referral Platform for SaaS companies.

Turn customer success stories into automated marketing machines.

## Features

- Modern dark landing page
- AI Testimonial Polish (Gemini 1.5 Flash)
- Case Study Generator
- Social Media Post Generator
- Save stories + Public success pages (`/p/[id]`) with "Powered by ProofLoop"
- My Stories list
- **Supabase Auth** (Login / Signup)
- Database schema ready (stories table + RLS)

## Setup

1. Clone & install
```bash
git clone https://github.com/SyedMastafa/proofloop.git
cd proofloop
npm install
```

2. Environment variables  
Copy `.env.example` → `.env.local` and fill:

```
GEMINI_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

- Gemini free key: https://aistudio.google.com/apikey
- Supabase: https://supabase.com → New project → Settings → API

3. Run the SQL schema  
In Supabase Dashboard → SQL Editor → paste contents of `supabase/schema.sql` → Run

4. Start
```bash
npm run dev
```

- Landing: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard
- Stories: http://localhost:3000/stories

## Roadmap

- [x] Landing + AI Generator
- [x] Save + Public pages
- [x] Real Auth + Database (Supabase)
- [ ] Embeddable widget
- [ ] Referral tracking
- [ ] Stripe billing
- [ ] ROI calculator

## Tech

- Next.js 15 + TypeScript + Tailwind
- Google Gemini (free)
- Supabase (Auth + Postgres)

## License

MIT
