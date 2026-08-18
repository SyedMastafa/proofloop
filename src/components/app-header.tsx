"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

type AppHeaderProps = {
  links?: { href: string; label: string }[];
};

const defaultLinks = [
  { href: "/dashboard", label: "Generator" },
  { href: "/stories", label: "Stories" },
  { href: "/pricing", label: "Pricing" },
];

export function AppHeader({ links = defaultLinks }: AppHeaderProps) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-sm font-bold text-white">
            P
          </div>
          <span className="text-lg font-semibold text-[var(--foreground)]">ProofLoop</span>
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
