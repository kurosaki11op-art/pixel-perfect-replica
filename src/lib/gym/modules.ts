import type { EntityKind, Permission } from "./domain";
import { planOptions } from "./demo-data";
export type ModuleField = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "time" | "email" | "tel" | "textarea";
  options?: string[];
  required?: boolean;
};
export type ModuleConfig = {
  kind: EntityKind;
  title: string;
  subtitle: string;
  action?: string;
  permission?: Permission;
  fields: ModuleField[];
  columns: { key: string; label: string; format?: "money" | "date" | "status" }[];
};
const member = { key: "name", label: "Member name", required: true };
const date = { key: "date", label: "Date", type: "date" as const, required: true };
const amount = { key: "amount", label: "Amount (₹)", type: "number" as const, required: true };
const status = { key: "status", label: "Status", options: ["Active", "Inactive"] };
const plan = { key: "plan", label: "Plan", options: planOptions, required: true };
export const modules: Record<string, ModuleConfig> = {
  memberships: {
    kind: "memberships",
    title: "Memberships",
    subtitle: "Create, renew, and monitor membership records.",
    action: "Create membership",
    permission: "memberships.write",
    fields: [
      member,
      plan,
      { key: "start", label: "Start date", type: "date", required: true },
      { key: "end", label: "End date", type: "date", required: true },
      { key: "payment", label: "Payment status", options: ["Pending", "Paid"] },
      { key: "status", label: "Status", options: ["Active", "Expiring", "Expired", "Upcoming"] },
    ],
    columns: [
      { key: "id", label: "Membership ID" },
      { key: "name", label: "Member" },
      { key: "plan", label: "Plan" },
      { key: "start", label: "Start", format: "date" },
      { key: "end", label: "End", format: "date" },
      { key: "payment", label: "Payment" },
      { key: "status", label: "Status", format: "status" },
    ],
  },
  plans: {
    kind: "plans",
    title: "Plans & Offers",
    subtitle: "Membership plans with transparent, illustrative pricing.",
    action: "Create plan",
    permission: "plans.manage",
    fields: [
      { key: "name", label: "Plan name", required: true },
      { key: "duration", label: "Duration", required: true },
      amount,
      status,
    ],
    columns: [
      { key: "name", label: "Plan" },
      { key: "duration", label: "Duration" },
      { key: "amount", label: "Price", format: "money" },
      { key: "status", label: "Status", format: "status" },
    ],
  },
  offers: {
    kind: "offers",
    title: "Offers",
    subtitle: "Offer terms remain subject to backend verification.",
    action: "Create offer",
    permission: "plans.manage",
    fields: [
      { key: "name", label: "Offer name", required: true },
      { key: "discount", label: "Discount description", required: true },
      date,
      { key: "end", label: "Valid until", type: "date", required: true },
      { key: "description", label: "Terms", type: "textarea" },
      { key: "status", label: "Status", options: ["Active", "Scheduled", "Inactive"] },
    ],
    columns: [
      { key: "name", label: "Offer" },
      { key: "discount", label: "Discount" },
      { key: "date", label: "Start", format: "date" },
      { key: "end", label: "End", format: "date" },
      { key: "status", label: "Status", format: "status" },
    ],
  },
  attendance: {
    kind: "attendance",
    title: "Attendance",
    subtitle: "Biometric attendance preview. No live device is connected.",
    fields: [],
    columns: [
      { key: "name", label: "Member" },
      { key: "memberId", label: "Member ID" },
      { key: "date", label: "Date", format: "date" },
      { key: "checkIn", label: "Check-in" },
      { key: "checkOut", label: "Automatic checkout" },
      { key: "plan", label: "Plan" },
      { key: "status", label: "Status", format: "status" },
    ],
  },
  payments: {
    kind: "payments",
    title: "Payments",
    subtitle: "Payment records, membership associations, and receipt previews.",
    action: "Record payment",
    permission: "payments.write",
    fields: [
      member,
      amount,
      date,
      {
        key: "method",
        label: "Payment method",
        options: ["Cash", "UPI", "Card", "Bank transfer"],
        required: true,
      },
      { key: "membership", label: "Membership ID", required: true },
      {
        key: "category",
        label: "Category",
        options: ["Membership", "Renewal", "Personal training"],
      },
      { key: "status", label: "Status", options: ["Pending", "Paid"] },
    ],
    columns: [
      { key: "id", label: "Payment ID" },
      { key: "name", label: "Member" },
      { key: "date", label: "Date", format: "date" },
      { key: "amount", label: "Amount", format: "money" },
      { key: "method", label: "Method" },
      { key: "status", label: "Status", format: "status" },
    ],
  },
  expenses: {
    kind: "expenses",
    title: "Expenses",
    subtitle: "Track operating costs and keep every expense organized.",
    action: "Add expense",
    permission: "finance.read",
    fields: [
      { key: "name", label: "Expense description", required: true },
      amount,
      date,
      {
        key: "category",
        label: "Category",
        options: ["Maintenance", "Utilities", "Supplies", "Rent", "Staff", "Other"],
      },
      { key: "method", label: "Payment method", options: ["Cash", "UPI", "Card", "Bank transfer"] },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
    columns: [
      { key: "id", label: "Expense ID" },
      { key: "name", label: "Expense" },
      { key: "date", label: "Date", format: "date" },
      { key: "category", label: "Category" },
      { key: "amount", label: "Amount", format: "money" },
      { key: "status", label: "Status", format: "status" },
    ],
  },
  appointments: {
    kind: "appointments",
    title: "Appointments",
    subtitle: "Coordinate training sessions, assessments, and consultations.",
    action: "Book appointment",
    permission: "appointments.write",
    fields: [
      member,
      date,
      { key: "time", label: "Time", type: "time", required: true },
      { key: "trainer", label: "Trainer", options: ["Demo Trainer A", "Demo Trainer B"] },
      {
        key: "type",
        label: "Appointment type",
        options: ["Personal training", "Fitness assessment", "Consultation"],
      },
      {
        key: "status",
        label: "Status",
        options: ["Scheduled", "Confirmed", "Completed", "Cancelled"],
      },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
    columns: [
      { key: "name", label: "Member" },
      { key: "date", label: "Date", format: "date" },
      { key: "time", label: "Time" },
      { key: "trainer", label: "Trainer" },
      { key: "type", label: "Session" },
      { key: "status", label: "Status", format: "status" },
    ],
  },
  staff: {
    kind: "staff",
    title: "Staff & Trainers",
    subtitle: "Trainer accounts and reception duties, managed by Admin.",
    action: "Create staff account",
    permission: "staff.manage",
    fields: [
      { key: "name", label: "Display name", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "Phone", type: "tel", required: true },
      { key: "category", label: "Staff category", options: ["Trainer"] },
      { key: "role", label: "Authentication role", options: ["Staff"] },
      { key: "shift", label: "Shift", options: ["Morning", "Evening", "Full day"] },
      { key: "duties", label: "Duties", options: ["Training", "Training & reception"] },
      { key: "status", label: "Account status", options: ["Enabled", "Disabled"] },
    ],
    columns: [
      { key: "name", label: "Trainer" },
      { key: "email", label: "Email" },
      { key: "category", label: "Category" },
      { key: "shift", label: "Shift" },
      { key: "duties", label: "Duties" },
      { key: "status", label: "Account", format: "status" },
    ],
  },
  audit: {
    kind: "audit",
    title: "Audit Logs",
    subtitle: "Illustrative activity history. Real audit events must be backend-generated.",
    fields: [],
    columns: [
      { key: "name", label: "Action" },
      { key: "actor", label: "Actor" },
      { key: "date", label: "Date", format: "date" },
      { key: "time", label: "Time" },
      { key: "entity", label: "Entity" },
      { key: "status", label: "Type", format: "status" },
    ],
  },
  automations: {
    kind: "automations",
    title: "Automation Center",
    subtitle: "Configure previews only. No jobs or notifications will run.",
    action: "Configure automation",
    permission: "automation.manage",
    fields: [
      { key: "name", label: "Automation name", required: true },
      { key: "schedule", label: "Schedule", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "status", label: "Status", options: ["Preview only", "Not connected"] },
    ],
    columns: [
      { key: "name", label: "Automation" },
      { key: "schedule", label: "Schedule" },
      { key: "status", label: "Status", format: "status" },
      { key: "lastRun", label: "Last execution" },
    ],
  },
};
