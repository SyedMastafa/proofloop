import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/resend";

/**
 * Phase 3: process due sequence enrollments.
 * Secure with CRON_SECRET header: Authorization: Bearer <CRON_SECRET>
 * Vercel Cron: GET/POST daily or hourly.
 */
export async function GET(req: NextRequest) {
  return run(req);
}

export async function POST(req: NextRequest) {
  return run(req);
}

async function run(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization") || "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const service = createServiceClient();
  if (!service) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY missing" },
      { status: 500 }
    );
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://proofloop-eta.vercel.app";
  const now = new Date().toISOString();

  const { data: due, error } = await service
    .from("sequence_enrollments")
    .select("*, leads(email), sequences(is_active, name)")
    .eq("status", "active")
    .lte("next_run_at", now)
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: { enrollmentId: string; ok: boolean; detail: string }[] = [];

  for (const en of due || []) {
    const seq = en.sequences as { is_active?: boolean; name?: string } | null;
    if (!seq?.is_active) {
      results.push({
        enrollmentId: en.id,
        ok: false,
        detail: "sequence inactive",
      });
      continue;
    }

    const lead = en.leads as { email?: string } | null;
    const to = lead?.email;
    if (!to) {
      results.push({ enrollmentId: en.id, ok: false, detail: "no email" });
      continue;
    }

    const { data: steps } = await service
      .from("sequence_steps")
      .select("*")
      .eq("sequence_id", en.sequence_id)
      .order("step_order", { ascending: true });

    const stepList = steps || [];
    const step = stepList[en.current_step];
    if (!step) {
      await service
        .from("sequence_enrollments")
        .update({ status: "completed" })
        .eq("id", en.id);
      results.push({
        enrollmentId: en.id,
        ok: true,
        detail: "completed",
      });
      continue;
    }

    const subject = step.subject.replace(/\{\{app_url\}\}/g, appUrl);
    const body = step.body.replace(/\{\{app_url\}\}/g, appUrl);

    // Create task as approved+send, or draft if no Resend
    const sendResult = await sendEmail({ to, subject, body });

    await service.from("agent_tasks").insert({
      lead_id: en.lead_id,
      type: "sequence_email",
      status: sendResult.ok ? "sent" : "failed",
      subject,
      body,
      to_email: to,
      sent_at: sendResult.ok ? now : null,
      error: sendResult.error || null,
      meta: {
        sequence_id: en.sequence_id,
        step: en.current_step,
        resendId: sendResult.id,
      },
    });

    const nextStep = en.current_step + 1;
    const next = stepList[nextStep];
    if (!next) {
      await service
        .from("sequence_enrollments")
        .update({ status: "completed", current_step: nextStep })
        .eq("id", en.id);
    } else {
      const nextRun = new Date();
      nextRun.setDate(nextRun.getDate() + (next.delay_days || 0));
      await service
        .from("sequence_enrollments")
        .update({
          current_step: nextStep,
          next_run_at: nextRun.toISOString(),
        })
        .eq("id", en.id);
    }

    results.push({
      enrollmentId: en.id,
      ok: sendResult.ok,
      detail: sendResult.ok ? "sent" : sendResult.error || "failed",
    });
  }

  return NextResponse.json({
    processed: results.length,
    results,
  });
}
