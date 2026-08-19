/** Plan story limits — enforce on save (logged-in users). */

export const FREE_STORY_LIMIT = 3;

export const PLAN_LIMITS: Record<string, number> = {
  free: 3,
  starter: 25,
  growth: 10_000,
  agency: 10_000,
};

export function storyLimitForPlan(plan: string | null | undefined): number {
  if (!plan) return FREE_STORY_LIMIT;
  return PLAN_LIMITS[plan] ?? FREE_STORY_LIMIT;
}
