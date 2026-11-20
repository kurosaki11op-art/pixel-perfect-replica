import { z } from "zod";
export const calendarDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date")
  .refine((value) => {
    const [y, m, d] = value.split("-").map(Number);
    if (y === undefined || m === undefined || d === undefined) return false;
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  }, "Choose a real calendar date");
export function formatCalendarDate(value: string) {
  if (!calendarDate.safeParse(value).success) return "—";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 1)));
}
export function remainingDays(end: string, today: string) {
  return Math.round((Date.parse(end + "T00:00:00Z") - Date.parse(today + "T00:00:00Z")) / 86400000);
}
export function membershipStatus(start: string, end: string, today: string) {
  if (start > today) return "Upcoming";
  const days = remainingDays(end, today);
  return days < 0 ? "Expired" : days <= 7 ? "Expiring" : "Active";
}
export const rupees = (amount: number | string | undefined) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
