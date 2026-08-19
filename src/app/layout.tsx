import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://proofloop-eta.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ProofLoop — Turn Customer Success into Marketing",
    template: "%s · ProofLoop",
  },
  description:
    "AI-powered testimonials, case studies, embeds & referrals for B2B SaaS. Product-led growth with built-in branding.",
  keywords: [
    "testimonials",
    "case studies",
    "SaaS marketing",
    "social proof",
    "AI",
    "product-led growth",
  ],
  authors: [{ name: "ProofLoop" }],
  openGraph: {
    title: "ProofLoop — Customer proof on autopilot",
    description:
      "Generate testimonials, case studies, embeds, and referral links from real feedback.",
    url: siteUrl,
    siteName: "ProofLoop",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProofLoop",
    description: "AI customer proof & referrals for B2B SaaS.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('proofloop-theme');
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.classList.add(t);
    document.documentElement.style.colorScheme = t;
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
