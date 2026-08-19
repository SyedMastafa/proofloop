/** Client-side product event tracker */

export function track(
  event: string,
  meta?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  try {
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, meta }),
      keepalive: true,
    });
  } catch {
    /* ignore */
  }
}
