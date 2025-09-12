export const toIsoish = (s: string | number | Date) => {
  if (!s) return 0;
  s = s.toString();
  return s.includes("T") ? s : s.replace(" ", "T");
};

export const parseDate = (s: string | number | Date) => {
  try {
    const d = new Date(toIsoish(s));
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
};

export const formatDate = (s: string | number | Date) => {
  const d = parseDate(s);
  if (!d) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const initials = (name: string) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts[1]?.[0] || "";
  return (first + last).toUpperCase() || name[0].toUpperCase();
};

export const scoreColor = (n: number | null) => {
  if (n == null) return "bg-gray-100 text-gray-600";
  if (n >= 9) return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
  if (n >= 7) return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
  return "bg-rose-50 text-rose-700 ring-1 ring-rose-100";
};
