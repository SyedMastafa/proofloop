# ProofLoop

AI-powered Customer Proof & Referral Platform for SaaS.

## Features

- AI Generator (Gemini): testimonials, case studies, social posts
- Public success pages + embeddable widget
- Referral tracking
- Supabase Auth
- **Stripe billing** (pricing + checkout)

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing |
| `/pricing` | Plans + Stripe checkout |
| `/dashboard` | AI Generator |
| `/stories` | Saved stories |
| `/p/[id]` | Public success page |
| `/embed` | Widget embed code |
| `/referrals` | Referral links |
| `/r/[code]` | Referral redirect |
| `/billing/success` | After payment |
| `/billing/cancel` | Checkout canceled |

## Setup

```bash
git clone https://github.com/SyedMastafa/proofloop.git
cd proofloop && npm install
cp .env.example .env.local
```

### Environment variables

```
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Stripe (optional until you charge)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_GROWTH=
STRIPE_PRICE_AGENCY=
```

Without Stripe keys, checkout uses a **mock success page** so you can test the flow.

### Stripe setup (when ready)

1. [dashboard.stripe.com](https://dashboard.stripe.com) → Products → create Starter / Growth / Agency
2. Copy each **Price ID** (`price_...`) into env vars
3. Developers → Webhooks → endpoint `https://your-domain.com/api/webhooks/stripe`
4. Events: `checkout.session.completed`, `customer.subscription.deleted`

### Supabase

Run `supabase/schema.sql` (and optionally `schema_referrals.sql`).

## Deploy (Vercel)

Import repo → add all env vars → Deploy. **Never commit real keys.**

## Roadmap

- [x] AI Generator + public pages
- [x] Auth + schema
- [x] Embed widget
- [x] Referral tracking
- [x] Stripe billing

MIT
