# ProofLoop

AI-powered Customer Proof & Referral Platform for SaaS.

## Features

- Landing + AI Generator (Gemini): testimonials, case studies, social posts
- Save stories + public pages (`/p/[id]`) with branding
- Embeddable widget (`/embed`)
- Supabase Auth
- **Referral tracking** (`/referrals`, `/r/[code]`)

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing |
| `/dashboard` | AI Generator |
| `/stories` | Saved stories |
| `/p/[id]` | Public success page |
| `/embed` | Widget embed code |
| `/referrals` | Create & track referral links |
| `/r/[code]` | Referral click → signup |
| `/login` `/signup` | Auth |

## Setup

```bash
git clone https://github.com/SyedMastafa/proofloop.git
cd proofloop && npm install
cp .env.example .env.local
```

Fill `.env.local` (or Vercel env at deploy):

```
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Supabase SQL:
1. `supabase/schema.sql`
2. Optional: `supabase/schema_referrals.sql`

```bash
npm run dev
```

## Deploy

Push to GitHub → Import on Vercel → add env vars → Deploy. Never commit real API keys.

## Roadmap

- [x] AI Generator + public pages
- [x] Auth + schema
- [x] Embed widget
- [x] Referral tracking
- [ ] Stripe billing

MIT
