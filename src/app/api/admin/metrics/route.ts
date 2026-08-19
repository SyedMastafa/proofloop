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

    let storyCount = 0;
    let storiesLast7 = 0;
    let typeBreakdown: Record<string, number> = {};
    let recentStories: {
      id: string;
      title: string;
      type: string;
      created_at: string;
      user_id: string;
    }[] = [];

    const db = service || supabase;

    const { count } = await db
      .from("stories")
      .select("*", { count: "exact", head: true });
    storyCount = count ?? 0;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { count: wCount } = await db
      .from("stories")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString());
    storiesLast7 = wCount ?? 0;

    const { data: typeRows } = await db.from("stories").select("type");
    if (typeRows) {
      for (const row of typeRows as { type: string }[]) {
        typeBreakdown[row.type] = (typeBreakdown[row.type] || 0) + 1;
      }
    }

    const { data: recent } = await db
      .from("stories")
      .select("id, title, type, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(15);
    recentStories = (recent as typeof recentStories) || [];

    let userCount: number | null = null;
    let users: {
      id: string;
      email?: string;
      created_at: string;
      last_sign_in_at?: string | null;
    }[] = [];

    if (service) {
      const { data: listData, error } = await service.auth.admin.listUsers({
        page: 1,
        perPage: 50,
      });
      if (!error && listData?.users) {
        userCount = listData.users.length;
        // listUsers doesn't return total easily on all versions — use length of page as approx
        users = listData.users.map((u) => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
        }));
        // Better total: if fewer than 50, that's total; else mark as 50+
        if (listData.users.length < 50) {
          userCount = listData.users.length;
        }
      }
    }

    return NextResponse.json({
      storyCount,
      storiesLast7,
      typeBreakdown,
      recentStories,
      userCount,
      users,
      hasServiceRole: Boolean(service),
      adminEmail: user.email,
    });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}
