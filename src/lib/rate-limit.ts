/** Simple in-memory rate limiter (per serverless instance). Good enough for MVP. */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  let b = buckets.get(key);

  if (!b || now > b.resetAt) {
    b = { count: 0, resetAt: now + windowMs };
    buckets.set(key, b);
  }

  b.count += 1;
  const remaining = Math.max(0, limit - b.count);
  const retryAfterSec = Math.ceil((b.resetAt - now) / 1000);

  if (b.count > limit) {
    return { ok: false, remaining: 0, retryAfterSec };
  }

  return { ok: true, remaining, retryAfterSec };
}

export function clientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}
