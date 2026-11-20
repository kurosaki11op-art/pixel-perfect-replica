import type { Permission, Role } from "./domain";
const all: Permission[] = [
  "members.read",
  "members.write",
  "members.delete",
  "memberships.write",
  "plans.read",
  "plans.manage",
  "attendance.read",
  "appointments.write",
  "payments.write",
  "finance.read",
  "staff.manage",
  "analytics.read",
  "reports.read",
  "audit.read",
  "settings.manage",
  "automation.manage",
];
export const rolePermissions: Record<Role, readonly Permission[]> = {
  admin: all,
  staff: [
    "members.read",
    "members.write",
    "memberships.write",
    "plans.read",
    "attendance.read",
    "appointments.write",
    "payments.write",
  ],
};
export function can(role: Role, permission: Permission) {
  return rolePermissions[role].includes(permission);
}
export const routePermissions: Record<string, Permission> = {
  "/members": "members.read",
  "/memberships": "memberships.write",
  "/plans-offers": "plans.manage",
  "/plans": "plans.read",
  "/attendance": "attendance.read",
  "/appointments": "appointments.write",
  "/payments": "payments.write",
  "/income": "finance.read",
  "/expenses": "finance.read",
  "/trainers-staff": "staff.manage",
  "/analytics": "analytics.read",
  "/reports": "reports.read",
  "/audit-logs": "audit.read",
  "/settings": "settings.manage",
  "/automation-center": "automation.manage",
};
export const publicPaths = [
  "/admin-login",
  "/staff-login",
  "/forgot-password",
  "/reset-password",
  "/session-expired",
  "/unauthorized",
  "/account-disabled",
];
export function canAccess(role: Role, path: string) {
  const match = Object.keys(routePermissions).find(
    (key) => path === key || path.startsWith(key + "/"),
  );
  const permission = match ? routePermissions[match] : undefined;
  return permission === undefined || can(role, permission);
}
