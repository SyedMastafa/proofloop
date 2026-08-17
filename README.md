# ProofLoop

AI-powered Customer Proof & Referral Platform for SaaS companies.

## Features

- Modern dark landing page
- AI Testimonial / Case Study / Social post generator (Gemini)
- Save stories + Public pages (`/p/[id]`) with branding
- My Stories list
- Supabase Auth (Login / Signup)
- **Embeddable widget** (`/embed` + `/api/embed`)
- Database schema ready

## Quick start

```bash
git clone https://github.com/SyedMastafa/proofloop.git
cd proofloop
npm install
cp .env.example .env.local
# Add GEMINI_API_KEY + Supabase keys
npm run dev
```

- `/` Landing
- `/dashboard` AI Generator
- `/stories` Saved stories
- `/embed` Widget embed code
- `/p/[id]` Public success page

## Env vars (never commit real keys)

```
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Put production keys only in **Vercel Environment Variables**.

## Supabase

1. Create project at supabase.com
2. Run `supabase/schema.sql` in SQL Editor
3. Copy URL + anon key to `.env.local`

## Roadmap

- [x] Landing + AI Generator
- [x] Save + Public pages
- [x] Auth + Database schema
- [x] Embeddable widget
- [ ] Referral tracking
- [ ] Stripe billing

## License

MIT
