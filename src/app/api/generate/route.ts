import { NextRequest, NextResponse } from "next/server";
import {
  polishTestimonial,
  generateCaseStudy,
  generateSocialPosts,
} from "@/lib/gemini";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`generate:${ip}`, 20, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Try again in ${rl.retryAfterSec}s.` },
        {
          status: 429,
          headers: { "Retry-After": String(rl.retryAfterSec) },
        }
      );
    }

    const body = await req.json();
    const { type, ...data } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    let result = "";

    switch (type) {
      case "testimonial":
        if (!data.rawFeedback) {
          return NextResponse.json(
            { error: "rawFeedback is required" },
            { status: 400 }
          );
        }
        result = await polishTestimonial(data.rawFeedback, data.companyName);
        break;

      case "case-study":
        if (!data.challenge || !data.solution || !data.results) {
          return NextResponse.json(
            { error: "challenge, solution and results are required" },
            { status: 400 }
          );
        }
        result = await generateCaseStudy(data);
        break;

      case "social":
        if (!data.content) {
          return NextResponse.json(
            { error: "content is required" },
            { status: 400 }
          );
        }
        result = await generateSocialPosts(data.content);
        break;

      default:
        return NextResponse.json(
          { error: "Invalid type. Use: testimonial | case-study | social" },
          { status: 400 }
        );
    }

    return NextResponse.json({ result });
  } catch (error: unknown) {
    console.error("Generate error:", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
