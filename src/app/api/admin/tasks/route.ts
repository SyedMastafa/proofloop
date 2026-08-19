import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import { runSalesAgent } from "@/lib/gemini";
import { sendEmail } from "@/lib/resend";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

export async function GET() {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const service = createServiceClient();
    if (!service) {
      return NextResponse.json({
        tasks: [],
        warning: "SUPABASE_SERVICE_ROLE_KEY required",
      });
    }

    const { data, error } = await service
      .from("agent_tasks")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return NextResponse.json({ tasks: data || [] });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const service = createServiceClient();
    if (!service) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY required" },
        { status: 500 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
    }

    const body = await req.json();
    const action = body.action as string;

    // Create draft(s) for a lead
    if (action === "draft_for_lead") {
      const leadId = body.leadId as string;
      const { data: lead, error } = await service
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single();
      if (error || !lead) {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      }

      const goal = `Write ONE short nurture email (Subject + Body) for this lead.
Email: ${lead.email}
Score: ${lead.score} (${lead.temperature})
Stage: ${lead.stage}
Last event: ${lead.last_event || "unknown"}
Goal: get them to create their first polished testimonial in ProofLoop or upgrade if active.
Return exactly:
SUBJECT: ...
BODY:
...`;

      const raw = await runSalesAgent(goal);
      let subject = "Quick tip: turn feedback into proof";
      let emailBody = raw;
      const subjMatch = raw.match(/SUBJECT:\s*(.+)/i);
      const bodyMatch = raw.match(/BODY:\s*([\s\S]+)/i);
      if (subjMatch) subject = subjMatch[1].trim().slice(0, 200);
      if (bodyMatch) emailBody = bodyMatch[1].trim();

      const { data: task, error: insErr } = await service
        .from("agent_tasks")
        .insert({
          lead_id: lead.id,
          type: "email",
          status: "draft",
          subject,
          body: emailBody,
          to_email: lead.email,
          meta: { temperature: lead.temperature, score: lead.score },
        })
        .select("*")
        .single();

      if (insErr) throw insErr;
      return NextResponse.json({ task });
    }

    // Approve / reject / send
    if (action === "set_status") {
      const taskId = body.taskId as string;
      const status = body.status as string;
      if (!["approved", "rejected", "draft"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      const { data, error } = await service
        .from("agent_tasks")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", taskId)
        .select("*")
        .single();
      if (error) throw error;
      return NextResponse.json({ task: data });
    }

    if (action === "send") {
      const taskId = body.taskId as string;
      const { data: task, error } = await service
        .from("agent_tasks")
        .select("*")
        .eq("id", taskId)
        .single();
      if (error || !task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }
      if (task.status !== "approved" && task.status !== "draft") {
        return NextResponse.json(
          { error: "Only draft/approved tasks can be sent" },
          { status: 400 }
        );
      }
      if (!task.to_email || !task.subject) {
        return NextResponse.json({ error: "Missing to/subject" }, { status: 400 });
      }

      const result = await sendEmail({
        to: task.to_email,
        subject: task.subject,
        body: task.body,
      });

      if (!result.ok) {
        await service
          .from("agent_tasks")
          .update({
            status: "failed",
            error: result.error,
            updated_at: new Date().toISOString(),
          })
          .eq("id", taskId);
        return NextResponse.json({ error: result.error }, { status: 502 });
      }

      const { data: updated } = await service
        .from("agent_tasks")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          error: null,
          meta: { ...(task.meta || {}), resendId: result.id },
        })
        .eq("id", taskId)
        .select("*")
        .single();

      return NextResponse.json({ task: updated, resendId: result.id });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}
