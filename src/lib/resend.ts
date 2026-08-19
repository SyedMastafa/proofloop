/** Optional Resend email send for approved agent tasks */

export async function sendEmail(opts: {
  to: string;
  subject: string;
  body: string;
  from?: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return { ok: false, error: "RESEND_API_KEY not set" };
  }

  const from =
    opts.from ||
    process.env.RESEND_FROM_EMAIL ||
    "ProofLoop <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: opts.subject,
        text: opts.body,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.message || JSON.stringify(data) };
    }
    return { ok: true, id: data.id };
  } catch (e: unknown) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Send failed",
    };
  }
}
