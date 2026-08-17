import { NextRequest, NextResponse } from "next/server";
import { PLANS, type PlanId } from "@/lib/plans";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const planId = body.planId as PlanId;
    const email = body.email as string | undefined;

    const plan = PLANS.find((p) => p.id === planId);
    if (!plan || plan.id === "free") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({
        url: `/billing/success?plan=${planId}&mock=1`,
        mock: true,
        message: "Stripe not configured. Using mock success page.",
      });
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secret);

    const priceId = plan.stripePriceId;
    if (!priceId || priceId.includes("placeholder")) {
      return NextResponse.json(
        {
          error:
            "Stripe Price ID not set. Create products in Stripe Dashboard and set STRIPE_PRICE_* env vars.",
        },
        { status: 400 }
      );
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
      cancel_url: `${origin}/billing/cancel`,
      customer_email: email || undefined,
      metadata: { planId },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Checkout error:", err);
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
