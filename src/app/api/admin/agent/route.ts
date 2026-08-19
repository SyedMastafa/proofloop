import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { runSalesAgent } from "@/lib/gemini";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip = clientIp(req);
    const rl = rateLimit(`admin-agent:${user.id || ip}`, 15, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Rate limit. Retry in ${rl.retryAfterSec}s` },
        { status: 429 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const goal = (body.goal as string)?.trim();
    const context = (body.context as string)?.trim();

    if (!goal || goal.length < 5) {
      return NextResponse.json(
        { error: "goal is required (min 5 chars)" },
        { status: 400 }
      );
    }

    const result = await runSalesAgent(goal, context);
    return NextResponse.json({ result });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Agent failed" },
      { status: 500 }
    );
  }
}
