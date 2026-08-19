import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import { runSalesAgent } from "@/lib/gemini";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const service = createServiceClient();
  if (!service) {
    return NextResponse.json({
      campaigns: [],
      warning: "SUPABASE_SERVICE_ROLE_KEY required",
    });
  }

  const { data, error } = await service
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(40);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ campaigns: data || [] });
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const service = createServiceClient();
  if (!service) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY required" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const action = body.action as string;

  if (action === "generate_weekly") {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
    }

    // Optional: pull recent public story titles for inspiration
    const { data: stories } = await service
      .from("stories")
      .select("title, type")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(5);

    const storyHint =
      stories && stories.length
        ? `Recent public story themes (do not invent customers): ${stories
            .map((s: { title: string; type: string }) => `${s.type}: ${s.title}`)
            .join(" | ")}`
        : "No public stories yet — use product positioning only.";

    const raw = await runSalesAgent(
      `Create 3 marketing posts for this week for ProofLoop.
For each post output exactly:
---
CHANNEL: x OR linkedin
TITLE: short label
BODY:
post text
---
${storyHint}`,
      body.context || ""
    );

    const blocks = raw.split(/---+/).map((b) => b.trim()).filter(Boolean);
    const created = [];

    for (const block of blocks) {
      const ch = block.match(/CHANNEL:\s*(\w+)/i)?.[1]?.toLowerCase();
      const title = block.match(/TITLE:\s*(.+)/i)?.[1]?.trim();
      const bodyMatch = block.match(/BODY:\s*([\s\S]+)/i)?.[1]?.trim();
      if (!bodyMatch) continue;
      const channel = ch === "linkedin" ? "linkedin" : "x";
      const { data, error } = await service
        .from("campaigns")
        .insert({
          title: title || `${channel} draft`,
          channel,
          body: bodyMatch,
          status: "idea",
          meta: { source: "weekly_agent" },
        })
        .select("*")
        .single();
      if (!error && data) created.push(data);
    }

    // Fallback: store whole output as one campaign
    if (created.length === 0) {
      const { data } = await service
        .from("campaigns")
        .insert({
          title: "Weekly pack (raw)",
          channel: "other",
          body: raw,
          status: "idea",
        })
        .select("*")
        .single();
      if (data) created.push(data);
    }

    return NextResponse.json({ campaigns: created, raw });
  }

  if (action === "set_status") {
    const updates: Record<string, unknown> = {
      status: body.status,
    };
    if (body.status === "published") {
      updates.published_at = new Date().toISOString();
    }
    const { data, error } = await service
      .from("campaigns")
      .update(updates)
      .eq("id", body.campaignId)
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ campaign: data });
  }

  if (action === "delete") {
    await service.from("campaigns").delete().eq("id", body.campaignId);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
