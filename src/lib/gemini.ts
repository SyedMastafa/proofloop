import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// gemini-1.5-flash is retired — use current Flash model
const MODEL = "gemini-2.5-flash";

export async function polishTestimonial(rawFeedback: string, companyName?: string) {
  const model = genAI.getGenerativeModel({ model: MODEL });

  const prompt = `
You are an expert B2B SaaS copywriter. 
Polish the following raw customer feedback into a professional, concise, high-converting testimonial.

Rules:
- Keep it authentic and natural
- Highlight specific results or benefits if mentioned
- Make it 2-4 sentences max
- Do not invent metrics that are not in the original
- Write in first person as the customer

${companyName ? `Company/Product name: ${companyName}` : ""}

Raw feedback:
"""
${rawFeedback}
"""

Return ONLY the polished testimonial text, nothing else.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

export async function generateCaseStudy(data: {
  customerName: string;
  companyName: string;
  industry?: string;
  challenge: string;
  solution: string;
  results: string;
  quote?: string;
}) {
  const model = genAI.getGenerativeModel({ model: MODEL });

  const prompt = `
You are an expert B2B case study writer for SaaS companies.

Create a professional case study using the Challenge → Solution → Results framework.

Customer: ${data.customerName}
Company: ${data.companyName}
${data.industry ? `Industry: ${data.industry}` : ""}

Challenge:
${data.challenge}

Solution:
${data.solution}

Results:
${data.results}

${data.quote ? `Customer Quote: "${data.quote}"` : ""}

Structure the output as clean Markdown with these sections:
# [Compelling Headline]
## About the Customer
## The Challenge
## The Solution
## The Results
## Customer Quote (if available)

Keep it concise, metric-driven, and professional. Do not invent any numbers.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

export async function generateSocialPosts(caseStudyOrTestimonial: string) {
  const model = genAI.getGenerativeModel({ model: MODEL });

  const prompt = `
Based on this customer success content, generate 2 social media posts:

1. A LinkedIn post (professional, storytelling style, 150-250 words)
2. A Twitter/X post (concise, punchy, under 280 characters)

Content:
"""
${caseStudyOrTestimonial}
"""

Return in this exact format:

LINKEDIN:
[post text]

TWITTER:
[post text]
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}
