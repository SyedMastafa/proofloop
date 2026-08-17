"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { trackReferralClick } from "@/lib/referral";

export default function ReferralRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  useEffect(() => {
    if (code) {
      trackReferralClick(code);
      router.replace(`/signup?ref=${code}`);
    }
  }, [code, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
      Redirecting...
    </div>
  );
}
