import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { can, canAccess, routePermissions } from "@/lib/gym/permissions";
import { calendarDate, formatCalendarDate, membershipStatus } from "@/lib/gym/dates";
import {
  memberSchema,
  paymentSchema,
  membershipSchema,
  loginSchema,
  normalizeError,
} from "@/lib/gym/validation";
import { demoMembers } from "@/lib/gym/demo-data";
import { DevelopmentApiAdapter, DevelopmentAuthAdapter } from "@/lib/gym/api";
import { DataTable, ErrorState } from "@/components/gym/shared";
import { afterEach } from "vitest";
afterEach(cleanup);
describe("Access rules", () => {
  it.each([
    "members.delete",
    "plans.manage",
    "staff.manage",
    "settings.manage",
    "analytics.read",
    "audit.read",
    "finance.read",
    "automation.manage",
  ] as const)("staff cannot %s", (permission) => expect(can("staff", permission)).toBe(false));
  it.each([
    "members.write",
    "memberships.write",
    "payments.write",
    "attendance.read",
    "appointments.write",
    "plans.read",
  ] as const)("staff can %s", (permission) => expect(can("staff", permission)).toBe(true));
  it.each(Object.keys(routePermissions))("admin can open %s", (path) =>
    expect(canAccess("admin", path)).toBe(true),
  );
  it.each([
    "/settings",
    "/analytics",
    "/audit-logs",
    "/trainers-staff",
    "/plans-offers",
    "/income",
    "/expenses",
  ])("staff direct URL restriction %s", (path) => expect(canAccess("staff", path)).toBe(false));
  it("staff can open member editing routes", () =>
    expect(canAccess("staff", "/members/BG-1024/edit")).toBe(true));
});
describe("Dates and forms", () => {
  it("preserves selected June dates without converting to May or today", () => {
    const input = {
      ...demoMembers[0],
      joined: "2026-06-01",
      start: "2026-06-01",
      end: "2026-06-30",
    };
    const parsed = memberSchema.parse(input);
    expect(parsed.start).toBe("2026-06-01");
    expect(parsed.end).toBe("2026-06-30");
    expect(formatCalendarDate("2026-06-01")).toBe("1 Jun 2026");
  });
  it("rejects invalid calendar dates", () =>
    expect(calendarDate.safeParse("2026-02-30").success).toBe(false));
  it("validates member registration and editing", () => {
    expect(memberSchema.safeParse({ ...demoMembers[0], name: "A", phone: "123" }).success).toBe(
      false,
    );
    expect(memberSchema.safeParse({ ...demoMembers[0], name: "Edited Member" }).success).toBe(true);
  });
  it("rejects membership end dates before selected start dates", () =>
    expect(
      membershipSchema.safeParse({
        name: "Priya Sharma",
        plan: "Standard",
        start: "2026-06-10",
        end: "2026-06-01",
      }).success,
    ).toBe(false));
  it("accepts renewal dates exactly as chosen", () =>
    expect(
      membershipSchema.parse({
        name: "Priya Sharma",
        plan: "Standard",
        start: "2026-06-01",
        end: "2026-07-01",
      }).start,
    ).toBe("2026-06-01"));
  it("checks expiry warnings in the next seven days", () => {
    expect(membershipStatus("2026-10-01", "2026-11-27", "2026-11-20")).toBe("Expiring");
    expect(membershipStatus("2026-10-01", "2026-11-19", "2026-11-20")).toBe("Expired");
  });
  it("validates login email and password fields", () => {
    expect(loginSchema.safeParse({ email: "no", password: "short" }).success).toBe(false);
    expect(
      loginSchema.safeParse({ email: "test@example.test", password: "12345678" }).success,
    ).toBe(true);
  });
  it("rejects zero and negative payment amounts", () => {
    const input = {
      name: "Priya Sharma",
      date: "2026-06-01",
      method: "UPI",
      membership: "MS-1001",
    };
    expect(paymentSchema.safeParse({ ...input, amount: 0 }).success).toBe(false);
    expect(paymentSchema.safeParse({ ...input, amount: -1 }).success).toBe(false);
    expect(paymentSchema.parse({ ...input, amount: 2000 }).amount).toBe(2000);
  });
});
describe("Adapters and tables", () => {
  it("marks mutations as previews and leaves seed data unchanged", async () => {
    const api = new DevelopmentApiAdapter();
    const first = demoMembers[0];
    if (!first) throw new Error("fixture missing");
    const result = await api.previewMember({ ...first, name: "Changed Name" });
    expect(result.mode).toBe("preview");
    expect((await api.listMembers())[0]?.name).toBe("Priya Sharma");
  });
  it("creates development sessions without real tokens", async () => {
    const session = await new DevelopmentAuthAdapter().enterPreview("staff");
    expect(session).toEqual({ role: "staff", name: "Demo Trainer", mode: "development" });
  });
  it("paginates, searches, filters empty results, and hides columns", () => {
    const rows = Array.from({ length: 12 }, (_, i) => ({ id: String(i), name: "Member " + i }));
    render(
      <DataTable
        rows={rows}
        searchKeys={(r) => r.name}
        columns={[
          { key: "name", label: "Name", value: (r) => r.name },
          { key: "id", label: "ID", value: (r) => r.id },
        ]}
      />,
    );
    expect(screen.getByText("1–5 of 12 demo records")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("6–10 of 12 demo records")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Search records"), { target: { value: "not found" } });
    expect(screen.getByText("No records found")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Clear filters"));
    expect(screen.getByText("1–5 of 12 demo records")).toBeInTheDocument();
  });
  it("normalizes and displays an API failure with retry", () => {
    const retry = vi.fn();
    const failure = normalizeError(new Error("Service unavailable"));
    render(<ErrorState message={failure.message} retry={retry} />);
    expect(screen.getByText("Service unavailable")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
