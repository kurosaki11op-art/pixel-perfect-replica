import { describe, it, expect } from "vitest";
import { expiringWithinSevenDays, filterAttendance } from "@/lib/gym-data";
describe("Dashboard data rules", () => {
  it("includes memberships expiring within the next seven days, but not expired or later memberships", () => {
    const rows = ["2026-11-19", "2026-11-20", "2026-11-27", "2026-11-28"].map((expiry) => ({
      expiry,
    }));
    expect(expiringWithinSevenDays(rows, "2026-11-20").map((row) => row.expiry)).toEqual([
      "2026-11-20",
      "2026-11-27",
    ]);
  });
  it("combines attendance search with status filtering", () => {
    expect(filterAttendance("sneha", "Inside")).toHaveLength(0);
    expect(filterAttendance("sneha", "Checked out").map((member) => member.id)).toEqual([
      "BG-0876",
    ]);
    expect(filterAttendance("bg-1024", "All statuses").map((member) => member.name)).toEqual([
      "Priya Sharma",
    ]);
  });
});
