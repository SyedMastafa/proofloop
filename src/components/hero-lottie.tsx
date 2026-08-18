"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

/** Free Lottie (LottieFiles CDN) — document / AI style, ~33KB */
const LOTTIE_URL =
  "https://assets10.lottiefiles.com/packages/lf20_usmfx6bp.json";

export function HeroLottie() {
  const [data, setData] = useState<object | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setFailed(true);
      return;
    }

    let cancelled = false;
    fetch(LOTTIE_URL)
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) return null;

  if (!data) {
    return (
      <div
        className="mx-auto h-40 w-40 animate-pulse rounded-2xl bg-[var(--surface)] sm:h-48 sm:w-48"
        aria-hidden
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[220px] sm:max-w-[280px]" aria-hidden>
      <Lottie animationData={data} loop autoplay className="h-auto w-full" />
    </div>
  );
}
