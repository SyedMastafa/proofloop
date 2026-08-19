import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

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
      sequences: [],
      enrollments: [],
      warning: "SUPABASE_SERVICE_ROLE_KEY required",
    });
  }

  const { data: sequences } = await service
    .from("sequences")
    .select("*, sequence_steps(*)")
    .order("created_at", { ascending: true });

  const { data: enrollments } = await service
    .from("sequence_enrollments")
    .select("*, leads(email)")
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json({
    sequences: sequences || [],
    enrollments: enrollments || [],
  });
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

  if (action === "toggle_active") {
    const { data, error } = await service
      .from("sequences")
      .update({ is_active: Boolean(body.is_active) })
      .eq("id", body.sequenceId)
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ sequence: data });
  }

  if (action === "enroll") {
    const sequenceId = body.sequenceId as string;
    const leadId = body.leadId as string;
    const { data: steps } = await service
      .from("sequence_steps")
      .select("delay_days")
      .eq("sequence_id", sequenceId)
      .order("step_order", { ascending: true })
      .limit(1);

    const delay = steps?.[0]?.delay_days ?? 0;
    const nextRun = new Date();
    nextRun.setDate(nextRun.getDate() + delay);

    const { data, error } = await service
      .from("sequence_enrollments")
      .upsert(
        {
          sequence_id: sequenceId,
          lead_id: leadId,
          current_step: 0,
          status: "active",
          next_run_at: nextRun.toISOString(),
        },
        { onConflict: "sequence_id,lead_id" }
      )
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ enrollment: data });
  }

  if (action === "set_enrollment_status") {
    const { data, error } = await service
      .from("sequence_enrollments")
      .update({ status: body.status })
      .eq("id", body.enrollmentId)
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ enrollment: data });
  }

  if (action === "set_lead_stage") {
    const { data, error } = await service
      .from("leads")
      .update({
        stage: body.stage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.leadId)
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ lead: data });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
