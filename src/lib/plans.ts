export type PlanId = "free" | "starter" | "growth" | "agency";

export const PLANS = [
  {
    id: "free" as const,
    name: "Free",
    price: 0,
    priceLabel: "$0",
    description: "Try ProofLoop with limited stories",
    features: [
      "3 customer stories",
      "AI testimonial polish",
      "Public success pages",
      "Powered by ProofLoop branding",
    ],
    stripePriceId: null,
    popular: false,
  },
  {
    id: "starter" as const,
    name: "Starter",
    price: 19,
    priceLabel: "$19",
    description: "For early-stage SaaS teams",
    features: [
      "25 stories / month",
      "Case study + social posts",
      "Embeddable widget",
      "Referral links",
      "Remove branding (optional)",
    ],
    stripePriceId: process.env.STRIPE_PRICE_STARTER || "price_starter_placeholder",
    popular: false,
  },
  {
    id: "growth" as const,
    name: "Growth",
    price: 59,
    priceLabel: "$59",
    description: "For growing product-led teams",
    features: [
      "Unlimited stories",
      "Everything in Starter",
      "Priority AI generation",
      "Team seats (3)",
      "Custom domain for public pages",
    ],
    stripePriceId: process.env.STRIPE_PRICE_GROWTH || "price_growth_placeholder",
    popular: true,
  },
  {
    id: "agency" as const,
    name: "Agency",
    price: 149,
    priceLabel: "$149",
    description: "For agencies managing multiple clients",
    features: [
      "Everything in Growth",
      "Unlimited team seats",
      "Multi-client workspaces",
      "White-label option",
      "Priority support",
    ],
    stripePriceId: process.env.STRIPE_PRICE_AGENCY || "price_agency_placeholder",
    popular: false,
  },
] as const;

export function getPlan(id: PlanId) {
  return PLANS.find((p) => p.id === id);
}
