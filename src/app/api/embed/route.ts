import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const theme = searchParams.get("theme") || "dark";

  const isDark = theme === "dark";
  const bg = isDark ? "#0f172a" : "#ffffff";
  const text = isDark ? "#f1f5f9" : "#0f172a";
  const muted = isDark ? "#94a3b8" : "#64748b";
  const border = isDark ? "#1e293b" : "#e2e8f0";
  const accent = "#6366f1";

  const script = `
(function() {
  var container = document.currentScript && document.currentScript.parentElement;
  if (!container) {
    container = document.getElementById("proofloop-widget") || document.body;
  }

  var style = document.createElement("style");
  style.textContent = [
    ".pl-widget { font-family: system-ui, -apple-system, sans-serif; max-width: 100%; }",
    ".pl-card { background: ${bg}; border: 1px solid ${border}; border-radius: 12px; padding: 16px; margin-bottom: 12px; }",
    ".pl-quote { color: ${text}; font-size: 15px; line-height: 1.6; margin: 0 0 12px 0; }",
    ".pl-meta { color: ${muted}; font-size: 13px; }",
    ".pl-brand { text-align: center; margin-top: 16px; font-size: 12px; color: ${muted}; }",
    ".pl-brand a { color: ${accent}; text-decoration: none; }"
  ].join("\\n");
  document.head.appendChild(style);

  var root = document.createElement("div");
  root.className = "pl-widget";
  root.innerHTML = [
    '<div class="pl-card">',
    '  <p class="pl-quote">"ProofLoop helped us turn customer feedback into polished case studies in minutes. Our sales team finally has proof ready for every deal."</p>',
    '  <div class="pl-meta">— Sarah Chen, Head of Growth</div>',
    '</div>',
    '<div class="pl-card">',
    '  <p class="pl-quote">"We went from chasing testimonials for weeks to publishing success stories the same day. Game changer for our SaaS."</p>',
    '  <div class="pl-meta">— Marcus Rivera, Founder</div>',
    '</div>',
    '<div class="pl-brand">Powered by <a href="https://github.com/SyedMastafa/proofloop" target="_blank" rel="noopener">ProofLoop</a></div>'
  ].join("");
  container.appendChild(root);
})();
`.trim();

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
