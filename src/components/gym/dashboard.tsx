import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, animate, useReducedMotion } from "framer-motion";
import {
  UsersRound,
  BadgeCheck,
  ScanLine,
  Clock3,
  CircleAlert,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  Plus,
  CalendarDays,
  Phone,
  ChevronRight,
  CreditCard,
  UserRoundPlus,
  CalendarPlus,
  ReceiptText,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  metrics,
  demoDate,
  expiryMembers,
  expiringWithinSevenDays,
  daysUntilExpiry,
} from "@/lib/gym-data";
import { DashboardCharts } from "./dashboard-charts";
import { AttendanceTable } from "./attendance-table";
const metricIcons = {
  members: UsersRound,
  active: BadgeCheck,
  inside: ScanLine,
  expiring: Clock3,
  expired: CircleAlert,
  revenue: IndianRupee,
};
function Counter({ value, currency = false }: { value: number; currency?: boolean }) {
  const [count, setCount] = useState(value);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const control = animate(0, value, { duration: 0.9, onUpdate: (v) => setCount(Math.round(v)) });
    return () => control.stop();
  }, [value, reduced]);
  return (
    <>
      {currency ? "₹" : ""}
      {count.toLocaleString("en-IN")}
    </>
  );
}
const actionFields: Record<string, { label: string; type?: string; options?: string[] }[]> = {
  "Add Member": [
    { label: "Full name" },
    { label: "Phone number", type: "tel" },
    { label: "Member category", options: ["Adults", "Kids"] },
  ],
  "Create Membership": [
    { label: "Member name" },
    {
      label: "Membership plan",
      options: ["Standard · Monthly", "Premium · 3 Months", "Premium · Annual", "Kids · Monthly"],
    },
    { label: "Start date", type: "date" },
  ],
  "Record Payment": [
    { label: "Member name" },
    { label: "Amount (₹)", type: "number" },
    { label: "Payment method", options: ["Cash", "UPI", "Card"] },
  ],
  "Book Appointment": [
    { label: "Member name" },
    { label: "Appointment date", type: "date" },
    { label: "Time", type: "time" },
  ],
};
export function Dashboard() {
  const [action, setAction] = useState<string | null>(null);
  const [preview, setPreview] = useState<Record<string, string> | null>(null);
  const [allExpiry, setAllExpiry] = useState(false);
  const [date, setDate] = useState("");
  const reduced = useReducedMotion();
  useEffect(
    () =>
      setDate(
        new Intl.DateTimeFormat("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Kolkata",
        }).format(new Date()),
      ),
    [],
  );
  const expiring = expiringWithinSevenDays(expiryMembers, demoDate);
  function openAction(name: string) {
    setPreview(null);
    setAction(name);
  }
  return (
    <motion.main
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="dashboard"
    >
      <div className="welcome">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] text-subtle">
            <span className="h-1 w-5 rounded-full bg-primary" />
            YOUR GYM, AT A GLANCE
          </div>
          <h1>
            Welcome back, Admin<span className="text-primary">.</span>
          </h1>
          <p>Here's what's happening at Believer Gym today.</p>
        </div>
        <div className="welcome-actions flex items-center gap-5">
          <span className="welcome-date flex items-center gap-2 text-[10px] text-muted-foreground">
            <CalendarDays size={14} />
            {date}
          </span>
          <Button onClick={() => openAction("Add Member")} className="h-9 text-[11px]">
            <Plus />
            Add Member
          </Button>
        </div>
      </div>
      <div className="metrics-grid">
        {metrics.map((metric, index) => {
          const Icon = metricIcons[metric.icon];
          return (
            <article key={metric.label} className="metric-card">
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`metric-icon ${index === 0 || index === 3 || index === 5 ? "red" : ""}`}
                >
                  <Icon size={16} />
                </div>
                <span className="text-[9px] text-subtle">{metric.trend}</span>
              </div>
              <div className="metric-value">
                <Counter value={metric.value} currency={metric.icon === "revenue"} />
              </div>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-note">
                {index === 0 || index === 1 || index === 5 ? (
                  <TrendingUp size={10} />
                ) : index === 3 ? (
                  <Clock3 size={10} />
                ) : null}
                {metric.note}
              </div>
            </article>
          );
        })}
      </div>
      <DashboardCharts />
      <div className="operations-grid">
        <AttendanceTable />
        <section className="data-panel">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Expiring Memberships</h2>
              <p className="panel-description">A little reminder goes a long way</p>
            </div>
            <span className="status-badge">Next 7 days</span>
          </div>
          <div className="expiry-list">
            {expiring.slice(0, 3).map((member, index) => {
              const days = daysUntilExpiry(member.expiry, demoDate);
              return (
                <div className="expiry-item" key={member.name}>
                  <div className={`member-avatar ${index % 2 === 0 ? "tint" : ""}`}>
                    {member.initials}
                  </div>
                  <div className="expiry-member">
                    <strong>{member.name}</strong>
                    <p>
                      {member.plan} ·{" "}
                      {new Date(member.expiry + "T00:00:00Z").toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        timeZone: "UTC",
                      })}
                    </p>
                    <a href={`tel:${member.phone.replace(/\s/g, "")}`}>
                      <Phone size={9} />
                      {member.phone}
                    </a>
                  </div>
                  <span className={`days-badge ${days <= 2 ? "urgent" : ""}`}>
                    {days} {days === 1 ? "day" : "days"} left
                  </span>
                </div>
              );
            })}
          </div>
          <div className="table-footer">
            <span>86 demo memberships expiring soon</span>
            <Button
              variant="ghost"
              className="h-auto p-0 text-[10px] text-muted-foreground"
              onClick={() => setAllExpiry(true)}
            >
              View all
              <ArrowUpRight size={12} />
            </Button>
          </div>
        </section>
      </div>
      <section className="quick-actions">
        <h2 className="panel-title">Quick Actions</h2>
        <div className="quick-action-grid">
          {[
            { label: "Add Member", icon: UserRoundPlus },
            { label: "Create Membership", icon: CreditCard },
            { label: "Record Payment", icon: ReceiptText },
            { label: "Book Appointment", icon: CalendarPlus },
          ].map((item) => (
            <Button variant="ghost" key={item.label} onClick={() => openAction(item.label)}>
              <span className="quick-action-icon">
                <item.icon size={16} />
              </span>
              {item.label}
              <ChevronRight size={12} className="ml-auto text-subtle" />
            </Button>
          ))}
          <Button variant="ghost" asChild>
            <Link to="/attendance">
              <span className="quick-action-icon">
                <ScanLine size={16} />
              </span>
              View Attendance
              <ChevronRight size={12} className="ml-auto text-subtle" />
            </Link>
          </Button>
        </div>
      </section>
      <footer className="dashboard-footer">
        <span>© 2026 Believer Gym · Unisex Gym</span>
        <span className="flex items-center gap-2">
          <span className="demo-badge">Demonstration data</span>
          <span>Sample snapshot · 20 Nov 2026</span>
        </span>
      </footer>
      <Dialog
        open={action !== null}
        onOpenChange={(open) => {
          if (!open) setAction(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogTitle>{preview ? "Review demonstration" : action}</DialogTitle>
          <DialogDescription>
            Preview only. No member, payment, or appointment will be saved.
          </DialogDescription>
          {preview ? (
            <>
              <div className="grid gap-4 py-3">
                {Object.entries(preview).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => setAction(null)}>
                <Check />
                Done
              </Button>
              <Button variant="outline" onClick={() => setPreview(null)}>
                Back to form
              </Button>
            </>
          ) : (
            <form
              className="demo-form"
              onSubmit={(e) => {
                e.preventDefault();
                setPreview(
                  Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<
                    string,
                    string
                  >,
                );
              }}
            >
              {(actionFields[action ?? ""] ?? []).map((field) => (
                <label key={field.label}>
                  {field.label}
                  {field.options ? (
                    <select required name={field.label} className="filter-select h-9 max-w-none">
                      {field.options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      name={field.label}
                      type={field.type ?? "text"}
                      required
                      min={field.type === "number" ? 1 : undefined}
                      placeholder={field.label}
                    />
                  )}
                </label>
              ))}
              <Button type="submit">
                Preview{" "}
                {action === "Add Member"
                  ? "member"
                  : action === "Record Payment"
                    ? "payment"
                    : action === "Book Appointment"
                      ? "appointment"
                      : "membership"}
                <ArrowUpRight />
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={allExpiry} onOpenChange={setAllExpiry}>
        <DialogContent className="max-w-lg">
          <DialogTitle>Expiring within 7 days</DialogTitle>
          <DialogDescription>
            Demonstration snapshot · 20 Nov 2026 · {expiring.length} sample members
          </DialogDescription>
          <div>
            {expiring.map((member) => (
              <div key={member.name} className="expiry-item">
                <div className="member-avatar tint">{member.initials}</div>
                <div className="expiry-member">
                  <strong>{member.name}</strong>
                  <p>
                    {member.plan} · {member.expiry}
                  </p>
                  <a href={`tel:${member.phone.replace(/\s/g, "")}`}>
                    <Phone size={10} />
                    {member.phone}
                  </a>
                </div>
                <span className="days-badge">
                  {daysUntilExpiry(member.expiry, demoDate)} days left
                </span>
              </div>
            ))}
          </div>
          <Button variant="outline" asChild>
            <Link to="/memberships">
              Memberships
              <ArrowUpRight />
            </Link>
          </Button>
        </DialogContent>
      </Dialog>
    </motion.main>
  );
}
