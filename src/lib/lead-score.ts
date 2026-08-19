/** Simple rule-based lead scoring from product events */

export const EVENT_SCORES: Record<string, number> = {
  signup: 10,
  login: 2,
  pricing_view: 15,
  story_generated: 8,
  story_saved: 20,
  public_page_view: 5,
  embed_view: 5,
  checkout_started: 40,
  checkout_completed: 80,
};

export function scoreFromEvents(events: string[]): {
  score: number;
  temperature: "hot" | "warm" | "cold";
} {
  let score = 0;
  const seen = new Set<string>();
  for (const e of events) {
    const pts = EVENT_SCORES[e] ?? 1;
    // Cap repeat events lightly
    const key = e;
    if (seen.has(key) && e !== "login") {
      score += Math.max(1, Math.floor(pts / 4));
    } else {
      score += pts;
      seen.add(key);
    }
  }
  score = Math.min(100, score);
  const temperature: "hot" | "warm" | "cold" =
    score >= 50 ? "hot" : score >= 25 ? "warm" : "cold";
  return { score, temperature };
}
