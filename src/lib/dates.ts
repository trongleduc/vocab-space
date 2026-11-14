export function dayIn(tz: string, d: Date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function addDays(day: string, n: number) {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function formatDay(day: string) {
  const d = new Date(`${day}T00:00:00Z`);
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export function weekdayShort(day: string) {
  const d = new Date(`${day}T00:00:00Z`);
  return ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][d.getUTCDay()];
}
