export type ReferralLink = {
  id: string;
  code: string;
  label: string;
  clicks: number;
  signups: number;
  createdAt: string;
};

const STORAGE_KEY = "proofloop_referrals";

function load(): ReferralLink[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(list: ReferralLink[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getReferralLinks(): ReferralLink[] {
  return load();
}

export function createReferralLink(label?: string): ReferralLink {
  const list = load();
  const code = Math.random().toString(36).slice(2, 10);
  const link: ReferralLink = {
    id: crypto.randomUUID(),
    code,
    label: label || "Default",
    clicks: 0,
    signups: 0,
    createdAt: new Date().toISOString(),
  };
  list.unshift(link);
  save(list);
  return link;
}

export function trackReferralClick(code: string) {
  const list = load();
  const item = list.find((l) => l.code === code);
  if (item) {
    item.clicks += 1;
    save(list);
  }
  if (typeof window !== "undefined") {
    localStorage.setItem("proofloop_ref_code", code);
  }
}

export function trackReferralSignup(code?: string) {
  const c = code || (typeof window !== "undefined" ? localStorage.getItem("proofloop_ref_code") : null);
  if (!c) return;
  const list = load();
  const item = list.find((l) => l.code === c);
  if (item) {
    item.signups += 1;
    save(list);
  }
}

export function getReferralByCode(code: string): ReferralLink | undefined {
  return load().find((l) => l.code === code);
}
