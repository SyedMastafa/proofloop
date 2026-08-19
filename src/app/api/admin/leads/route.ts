import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const service = createServiceClient();
    if (!service) {
      return NextResponse.json({
        leads: [],
        warning: "SUPABASE_SERVICE_ROLE_KEY required for leads",
      });
    }

    const { data, error } = await service
      .from("leads")
      .select("*")
      .order("score", { ascending: false })
      .limit(100);

    if (error) throw error;
    return NextResponse.json({ leads: data || [] });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}
