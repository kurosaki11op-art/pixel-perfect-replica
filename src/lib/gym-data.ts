export const demoDate = "2026-11-20";
export const metrics = [
  { label: "Total Members", value: 1248, note: "+32 this month", trend: "+2.6%", icon: "members" },
  {
    label: "Active Memberships",
    value: 1064,
    note: "85.3% of total members",
    trend: "+4.2%",
    icon: "active",
  },
  {
    label: "Members Currently Inside",
    value: 42,
    note: "18 ladies · 24 kids",
    trend: "Now",
    icon: "inside",
  },
  {
    label: "Expiring Soon",
    value: 86,
    note: "Within the next 7 days",
    trend: "7 days",
    icon: "expiring",
  },
  {
    label: "Expired Memberships",
    value: 98,
    note: "Ready for renewal",
    trend: "7.9%",
    icon: "expired",
  },
  {
    label: "Today's Revenue",
    value: 18500,
    note: "+₹3,200 vs. yesterday",
    trend: "+20.9%",
    icon: "revenue",
  },
] as const;

export const revenueData = {
  Daily: [
    { label: "8 AM", revenue: 1200, previous: 700 },
    { label: "10 AM", revenue: 2200, previous: 1400 },
    { label: "12 PM", revenue: 1800, previous: 1700 },
    { label: "2 PM", revenue: 3800, previous: 2200 },
    { label: "4 PM", revenue: 2700, previous: 2000 },
    { label: "6 PM", revenue: 4500, previous: 3700 },
    { label: "8 PM", revenue: 2300, previous: 3600 },
  ],
  Weekly: [
    { label: "Mon", revenue: 12500, previous: 8000 },
    { label: "Tue", revenue: 16800, previous: 12500 },
    { label: "Wed", revenue: 14200, previous: 11800 },
    { label: "Thu", revenue: 22100, previous: 16500 },
    { label: "Fri", revenue: 18500, previous: 15300 },
    { label: "Sat", revenue: 28400, previous: 21000 },
    { label: "Sun", revenue: 24600, previous: 19000 },
  ],
  Monthly: [
    { label: "Jun", revenue: 285000, previous: 248000 },
    { label: "Jul", revenue: 320000, previous: 269000 },
    { label: "Aug", revenue: 298000, previous: 254000 },
    { label: "Sep", revenue: 365000, previous: 297000 },
    { label: "Oct", revenue: 342000, previous: 286000 },
    { label: "Nov", revenue: 418500, previous: 346000 },
  ],
};
export type Period = keyof typeof revenueData;
export const membershipData = [
  { name: "Active memberships", value: 1064, fill: "var(--primary)" },
  { name: "Expiring soon", value: 86, fill: "var(--muted-foreground)" },
  { name: "Expired memberships", value: 98, fill: "var(--secondary)" },
];
export type AttendanceMember = {
  name: string;
  initials: string;
  id: string;
  time: string;
  plan: string;
  expiry: string;
  status: "Inside" | "Checked out";
};
export const attendance: AttendanceMember[] = [
  {
    name: "Priya Sharma",
    initials: "PS",
    id: "BG-1024",
    time: "09:15 AM",
    plan: "Premium · 3 Months",
    expiry: "20 Dec 2026",
    status: "Inside",
  },
  {
    name: "Ananya Patel",
    initials: "AP",
    id: "BG-1086",
    time: "09:32 AM",
    plan: "Standard · Monthly",
    expiry: "25 Nov 2026",
    status: "Inside",
  },
  {
    name: "Riya Mehta",
    initials: "RM",
    id: "BG-0942",
    time: "09:45 AM",
    plan: "Premium · Annual",
    expiry: "12 Mar 2027",
    status: "Inside",
  },
  {
    name: "Aarav Kumar",
    initials: "AK",
    id: "BG-1128",
    time: "10:02 AM",
    plan: "Kids · Monthly",
    expiry: "22 Nov 2026",
    status: "Inside",
  },
  {
    name: "Sneha Reddy",
    initials: "SR",
    id: "BG-0876",
    time: "08:40 AM",
    plan: "Standard · Monthly",
    expiry: "14 Dec 2026",
    status: "Checked out",
  },
];
export const expiryMembers = [
  {
    name: "Kavya Nair",
    initials: "KN",
    plan: "Premium · 3 Months",
    expiry: "2026-11-21",
    phone: "+91 98765 43210",
  },
  {
    name: "Aarav Kumar",
    initials: "AK",
    plan: "Kids · Monthly",
    expiry: "2026-11-22",
    phone: "+91 98765 43211",
  },
  {
    name: "Ananya Patel",
    initials: "AP",
    plan: "Standard · Monthly",
    expiry: "2026-11-25",
    phone: "+91 98765 43212",
  },
  {
    name: "Meera Iyer",
    initials: "MI",
    plan: "Premium · Monthly",
    expiry: "2026-11-27",
    phone: "+91 98765 43213",
  },
];
export function daysUntilExpiry(expiry: string, today: string) {
  return Math.round(
    (Date.parse(expiry + "T00:00:00Z") - Date.parse(today + "T00:00:00Z")) / 86400000,
  );
}
export function expiringWithinSevenDays<T extends { expiry: string }>(
  members: T[],
  today: string,
): T[] {
  return members.filter((member) => {
    const days = daysUntilExpiry(member.expiry, today);
    return days >= 0 && days <= 7;
  });
}
export function filterAttendance(query: string, status: string) {
  const term = query.trim().toLowerCase();
  return attendance.filter(
    (member) =>
      (status === "All statuses" || member.status === status) &&
      `${member.name} ${member.id} ${member.plan}`.toLowerCase().includes(term),
  );
}
export const notifications = [
  {
    title: "86 memberships expiring soon",
    detail: "Renewal window · next 7 days",
    time: "10 min ago",
  },
  {
    title: "Morning session attendance",
    detail: "42 members currently inside",
    time: "25 min ago",
  },
  {
    title: "Daily revenue summary",
    detail: "₹18,500 in demonstration payments",
    time: "1 hour ago",
  },
];
