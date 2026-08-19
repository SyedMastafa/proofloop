import { createClient } from "@/lib/supabase/client";

export type Story = {
  id: string;
  type: "testimonial" | "case-study" | "social";
  title: string;
  content: string;
  customerName?: string;
  companyName?: string;
  createdAt: string;
  isPublic?: boolean;
};

const STORAGE_KEY = "proofloop_stories";

type DbRow = {
  id: string;
  type: Story["type"];
  title: string;
  content: string;
  customer_name: string | null;
  company_name: string | null;
  created_at: string;
  is_public?: boolean;
};

function rowToStory(row: DbRow): Story {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    content: row.content,
    customerName: row.customer_name || undefined,
    companyName: row.company_name || undefined,
    createdAt: row.created_at,
    isPublic: row.is_public ?? true,
  };
}

function localGet(): Story[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function localSave(stories: Story[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}

async function currentUserId(): Promise<string | null> {
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

/** List stories for the current user (cloud) or local fallback */
export async function getStories(): Promise<Story[]> {
  const userId = await currentUserId();
  if (!userId) return localGet();

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as DbRow[]).map(rowToStory);
  } catch (e) {
    console.warn("getStories cloud failed, using local", e);
    return localGet();
  }
}

/** Save story — cloud if logged in, else localStorage */
export async function saveStory(
  story: Omit<Story, "id" | "createdAt">
): Promise<Story> {
  const userId = await currentUserId();

  if (!userId) {
    const stories = localGet();
    const newStory: Story = {
      ...story,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      isPublic: true,
    };
    stories.unshift(newStory);
    localSave(stories);
    return newStory;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("stories")
    .insert({
      user_id: userId,
      type: story.type,
      title: story.title,
      content: story.content,
      customer_name: story.customerName || null,
      company_name: story.companyName || null,
      is_public: true,
    })
    .select("*")
    .single();

  if (error) {
    console.warn("saveStory cloud failed, falling back to local", error);
    const stories = localGet();
    const newStory: Story = {
      ...story,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    stories.unshift(newStory);
    localSave(stories);
    return newStory;
  }

  return rowToStory(data as DbRow);
}

/** Public or owned story by id */
export async function getStory(id: string): Promise<Story | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) return rowToStory(data as DbRow);
  } catch {
    /* fall through */
  }

  return localGet().find((s) => s.id === id) || null;
}

export async function deleteStory(id: string): Promise<void> {
  const userId = await currentUserId();

  if (userId) {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("stories").delete().eq("id", id);
      if (error) throw error;
      return;
    } catch (e) {
      console.warn("deleteStory cloud failed", e);
    }
  }

  localSave(localGet().filter((s) => s.id !== id));
}

/** Migrate any local stories to cloud once user is logged in */
export async function migrateLocalStoriesToCloud(): Promise<number> {
  const userId = await currentUserId();
  if (!userId) return 0;

  const local = localGet();
  if (local.length === 0) return 0;

  const supabase = createClient();
  let migrated = 0;

  for (const s of local) {
    const { error } = await supabase.from("stories").insert({
      id: s.id,
      user_id: userId,
      type: s.type,
      title: s.title,
      content: s.content,
      customer_name: s.customerName || null,
      company_name: s.companyName || null,
      is_public: true,
      created_at: s.createdAt,
    });
    if (!error) migrated += 1;
  }

  if (migrated > 0) localSave([]);
  return migrated;
}
