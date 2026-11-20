export type Role = "admin" | "staff";
export type Permission =
  | "members.read"
  | "members.write"
  | "members.delete"
  | "memberships.write"
  | "plans.read"
  | "plans.manage"
  | "attendance.read"
  | "appointments.write"
  | "payments.write"
  | "finance.read"
  | "staff.manage"
  | "analytics.read"
  | "reports.read"
  | "audit.read"
  | "settings.manage"
  | "automation.manage";
export type DemoSession = { role: Role; name: string; mode: "development" };
export type Member = {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: "Adult" | "Kids";
  joined: string;
  emergencyName: string;
  emergencyPhone: string;
  status: "Active" | "Expiring" | "Expired";
  plan: string;
  start: string;
  end: string;
  notes: string;
};
export type EntityKind =
  | "memberships"
  | "plans"
  | "offers"
  | "attendance"
  | "payments"
  | "expenses"
  | "appointments"
  | "staff"
  | "audit"
  | "automations";
export type EntityRecord = {
  id: string;
  name: string;
  date: string;
  status: string;
  amount?: number | string;
  plan?: string;
  start?: string;
  end?: string;
  time?: string;
  trainer?: string;
  checkIn?: string;
  checkOut?: string;
  category?: string;
  type?: string;
  membership?: string;
  method?: string;
  [key: string]: string | number | undefined;
};
export type PreviewResult<T> = { mode: "preview"; data: T; message: string };
export type ApiFailure = {
  code: "validation" | "conflict" | "unavailable" | "unauthorized";
  message: string;
};
export interface AuthenticationProvider {
  restore(): Promise<DemoSession | null>;
  enterPreview(role: Role): Promise<DemoSession>;
  signOut(): Promise<void>;
}
export interface GymApiClient {
  listMembers(): Promise<Member[]>;
  previewMember(input: Member): Promise<PreviewResult<Member>>;
  list(kind: EntityKind): Promise<EntityRecord[]>;
  preview(kind: EntityKind, input: EntityRecord): Promise<PreviewResult<EntityRecord>>;
}
