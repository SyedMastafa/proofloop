import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ProofLoop — Turn Customer Success into Marketing",
    template: "%s · ProofLoop",
  },
  description:
    "AI-powered testimonials, case studies, embeds & referrals for B2B SaaS. Product-led growth with built-in branding.",
  openGraph: {
    title: "ProofLoop",
    description: "Automated customer proof & referral platform for SaaS.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#030712] text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
