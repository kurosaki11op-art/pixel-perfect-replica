import { z } from "zod";
import { calendarDate } from "./dates";
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[\d\s-]{10,16}$/, "Enter a valid phone number");
export const memberSchema = z
  .object({
    id: z.string(),
    name: z.string().trim().min(2, "Enter a full name"),
    phone: phoneSchema,
    email: z.string().email("Enter a valid email").or(z.literal("")),
    category: z.enum(["Adult", "Kids"]),
    joined: calendarDate,
    emergencyName: z.string().trim().min(2, "Enter an emergency contact name"),
    emergencyPhone: phoneSchema,
    status: z.enum(["Active", "Expiring", "Expired"]),
    plan: z.string().min(1, "Select a plan"),
    start: calendarDate,
    end: calendarDate,
    notes: z.string(),
  })
  .refine((x) => x.end >= x.start, {
    path: ["end"],
    message: "End date must be on or after start date",
  });
export const paymentSchema = z.object({
  name: z.string().trim().min(2, "Select a member"),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  date: calendarDate,
  method: z.enum(["Cash", "UPI", "Card", "Bank transfer"]),
  membership: z.string().min(1, "Select a membership"),
});
export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Enter at least 8 characters"),
});
export const membershipSchema = z
  .object({
    name: z.string().min(2, "Select a member"),
    plan: z.string().min(1, "Select a plan"),
    start: calendarDate,
    end: calendarDate,
  })
  .refine((x) => x.end >= x.start, {
    path: ["end"],
    message: "End date must be on or after start date",
  });
export function normalizeError(error: unknown) {
  return {
    code: "unavailable" as const,
    message: error instanceof Error ? error.message : "The service is not available. Try again.",
  };
}
