# ProofLoop

AI-powered Customer Proof & Referral Platform for SaaS companies.

Turn customer success stories into automated marketing machines.

## Current MVP Features

- Modern dark landing page
- AI Testimonial Polish (Gemini 1.5 Flash)
- Case Study Generator (Challenge → Solution → Results)
- Social Media Post Generator (LinkedIn + X)
- Save stories (localStorage for now)
- Public success story pages (`/p/[id]`) with "Powered by ProofLoop" branding
- My Stories list
- Login / Signup UI (auth coming next)

## Setup

```bash
npm install
```

Create `.env.local`:

```
GEMINI_API_KEY=your_key_here
```

Get free Gemini key: https://aistudio.google.com/apikey

```bash
npm run dev
```

- Landing: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard
- Stories: http://localhost:3000/stories

## Roadmap

- [x] Landing + AI Generator
- [x] Save + Public pages
- [ ] Real Auth + Database (Supabase)
- [ ] Embeddable widget
- [ ] Referral tracking
- [ ] Stripe billing
- [ ] ROI calculator

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Google Gemini (free tier)
- localStorage (temporary storage)

## License

MIT
