import { NextRequest, NextResponse } from "next/server";

/**
 * Stripe webhook handler.
 * Point endpoint to: https://your-domain.com/api/webhooks/stripe
 */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || !webhookSecret) {
    return NextResponse.json(
      { received: true, note: "Webhook secrets not configured" },
      { status: 200 }
    );
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secret);
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as {
          metadata?: { planId?: string };
          customer_email?: string;
          customer?: string;
        };
        console.log("Subscription started:", {
          planId: session.metadata?.planId,
          email: session.customer_email,
          customer: session.customer,
        });
        break;
      }
      case "customer.subscription.deleted": {
        console.log("Subscription canceled:", event.data.object);
        break;
      }
      default:
        console.log("Unhandled event:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    console.error("Webhook error:", err);
    const message = err instanceof Error ? err.message : "Webhook failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
