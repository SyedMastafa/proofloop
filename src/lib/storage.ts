export type Story = {
  id: string;
  type: "testimonial" | "case-study" | "social";
  title: string;
  content: string;
  customerName?: string;
  companyName?: string;
  createdAt: string;
};

const STORAGE_KEY = "proofloop_stories";

export function getStories(): Story[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStory(story: Omit<Story, "id" | "createdAt">): Story {
  const stories = getStories();
  const newStory: Story = {
    ...story,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  stories.unshift(newStory);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  return newStory;
}

export function getStory(id: string): Story | null {
  return getStories().find((s) => s.id === id) || null;
}

export function deleteStory(id: string) {
  const stories = getStories().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}
