import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { scoreFromEvents } from "@/lib/lead-score";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = String(body.event || "").trim();
    if (!event || event.length > 64) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    const meta = body.meta && typeof body.meta === "object" ? body.meta : {};

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const email =
      user?.email ||
      (typeof body.email === "string" ? body.email.toLowerCase() : null);

    const service = createServiceClient();
    const db = service || supabase;

    await db.from("product_events").insert({
      user_id: user?.id || null,
      email,
      event,
      meta,
    });

    // Upsert lead + rescore when we have email + service role
    if (email && service) {
      const { data: evRows } = await service
        .from("product_events")
        .select("event")
        .or(`email.eq.${email}${user?.id ? `,user_id.eq.${user.id}` : ""}`)
        .limit(100);

      const events = (evRows || []).map((r: { event: string }) => r.event);
      events.push(event);
      const { score, temperature } = scoreFromEvents(events);

      const { data: existing } = await service
        .from("leads")
        .select("id, stage")
        .eq("email", email)
        .maybeSingle();

      if (existing) {
        await service
          .from("leads")
          .update({
            score,
            temperature,
            user_id: user?.id || null,
            last_event: event,
            last_seen_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        await service.from("leads").insert({
          email,
          user_id: user?.id || null,
          source: typeof meta.source === "string" ? meta.source : "app",
          score,
          temperature,
          stage: "new",
          last_event: event,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error("events", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}
