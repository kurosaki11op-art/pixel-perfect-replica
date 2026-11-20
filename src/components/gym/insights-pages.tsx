import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Download,
  Plus,
  UsersRound,
  CreditCard,
  CalendarDays,
  Search,
  ScanLine,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, DataTable, StatusBadge, EmptyState, exportCsv } from "./shared";
import { DashboardCharts } from "./dashboard-charts";
import { demoEntities, snapshotDate } from "@/lib/gym/demo-data";
import { rupees, formatCalendarDate } from "@/lib/gym/dates";
import { useWorkspace } from "./workspace-provider";
import { ModulePage } from "./module-page";
export function IncomePage() {
  return (
    <>
      <main className="dashboard pb-0">
        <PageHeader
          title="Income"
          subtitle="Revenue, collection history, and receipt access — demo records only."
        />
        <DashboardCharts />
      </main>
      <ModulePage module="payments" />
    </>
  );
}
export function InsightsPage({ reports = false }: { reports?: boolean }) {
  const { members } = useWorkspace();
  const [period, setPeriod] = useState("Monthly");
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState(snapshotDate);
  const [report, setReport] = useState("Member growth");
  const [notice, setNotice] = useState("");
  const rangeValid = !from || !to || from <= to;
  const source = members.filter((m) => (!from || m.joined >= from) && (!to || m.joined <= to));
  const buckets = source.reduce<Record<string, number>>((map, m) => {
    const key =
      period === "Daily"
        ? m.joined
        : period === "Weekly"
          ? m.joined.slice(0, 7) + " W" + Math.ceil(Number(m.joined.slice(8)) / 7)
          : m.joined.slice(0, 7);
    map[key] = (map[key] ?? 0) + 1;
    return map;
  }, {});
  const chart = Object.entries(buckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
  const payments = demoEntities.payments.filter(
    (p) => (!from || p.date >= from) && (!to || p.date <= to),
  );
  const attendance = demoEntities.attendance.filter(
    (p) => (!from || p.date >= from) && (!to || p.date <= to),
  );
  const rows =
    report === "Financial overview"
      ? payments
      : report === "Attendance patterns"
        ? attendance
        : source.map((m) => ({ id: m.id, name: m.name, date: m.joined, status: m.status }));
  return (
    <main className="dashboard">
      <PageHeader
        title={reports ? "Reports" : "Analytics"}
        subtitle="Explore sample trends. Unavailable business metrics are not fabricated."
      >
        <Button
          disabled={!rangeValid || !rows.length}
          onClick={() => {
            exportCsv(
              rows as unknown as Record<string, unknown>[],
              `demo-${report.toLowerCase().replaceAll(" ", "-")}.csv`,
            );
            setNotice("Sample export prepared. No production data is included.");
          }}
        >
          <Download />
          Export sample report
        </Button>
      </PageHeader>
      <div className="insights-controls">
        <select
          className="workspace-select"
          aria-label="Report type"
          value={report}
          onChange={(e) => setReport(e.target.value)}
        >
          {[
            "Member growth",
            "Membership trends",
            "Attendance patterns",
            "Financial overview",
            "Expiring memberships",
            "Renewal metrics",
          ].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <div className="date-range">
          <Input
            type="date"
            aria-label="Analytics start date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <span>—</span>
          <Input
            type="date"
            aria-label="Analytics end date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className="period-switch">
          {["Daily", "Weekly", "Monthly"].map((p) => (
            <Button
              key={p}
              variant="ghost"
              aria-pressed={period === p}
              onClick={() => setPeriod(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>
      {!rangeValid && (
        <p role="alert" className="form-error mb-4">
          Start date must not be after end date.
        </p>
      )}
      {notice && (
        <p role="status" className="preview-notice mb-5">
          {notice}
        </p>
      )}
      <div className="summary-grid">
        <div className="summary-item">
          <span>Registrations in selected range</span>
          <strong>{source.length}</strong>
        </div>
        <div className="summary-item">
          <span>Sample collected revenue</span>
          <strong className="summary-small">
            {rupees(
              payments.filter((p) => p.status === "Paid").reduce((s, p) => s + Number(p.amount), 0),
            )}
          </strong>
        </div>
        <div className="summary-item">
          <span>Sample check-ins</span>
          <strong>{attendance.length}</strong>
        </div>
        <div className="summary-item">
          <span>Renewal conversion</span>
          <strong className="summary-small">Unavailable</strong>
        </div>
      </div>
      {report === "Renewal metrics" ? (
        <EmptyState
          title="Verified renewal data unavailable"
          description="Renewal conversion and retention require historical backend data."
        />
      ) : (
        <>
          <section className="insights-chart">
            <h2>
              {report === "Financial overview"
                ? "Revenue sample"
                : report === "Attendance patterns"
                  ? "Attendance sample"
                  : "Member registration sample"}
            </h2>
            {chart.length && rangeValid ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      report === "Financial overview"
                        ? payments.map((p) => ({ date: p.date, count: Number(p.amount) }))
                        : report === "Attendance patterns"
                          ? [{ date: snapshotDate, count: attendance.length }]
                          : chart
                    }
                  >
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    />
                    <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                    <Tooltip
                      content={({ active, payload, label }) =>
                        active ? (
                          <div className="rounded-md border border-border bg-popover p-3 text-xs">
                            {label}: {payload?.[0]?.value}
                          </div>
                        ) : null
                      }
                    />
                    <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState title="No data in this range" />
            )}
          </section>
          <DataTable
            rows={
              report === "Expiring memberships" ? rows.filter((r) => r.status === "Expiring") : rows
            }
            searchKeys={(r) => Object.values(r).join(" ")}
            columns={[
              { key: "id", label: "Record ID", value: (r) => r.id },
              { key: "name", label: "Member", value: (r) => r.name },
              {
                key: "date",
                label: "Date",
                value: (r) => r.date,
                render: (r) => formatCalendarDate(r.date),
              },
              {
                key: "status",
                label: "Status",
                value: (r) => r.status,
                render: (r) => <StatusBadge value={r.status} />,
              },
            ]}
          />
        </>
      )}
      <p className="workspace-footnote">
        Charts reflect only the sample rows and selected range. Historical business metrics require
        verified data.
      </p>
    </main>
  );
}
export function StaffDashboard() {
  const { members } = useWorkspace();
  const appointments = demoEntities.appointments.filter((r) => r.date === snapshotDate);
  return (
    <main className="dashboard">
      <PageHeader
        title="Reception dashboard"
        subtitle="Today’s people, sessions, and renewal priorities."
      />
      <div className="summary-grid staff-summary">
        {[
          { label: "Members currently inside", value: 42 },
          { label: "Today’s check-ins", value: 58 },
          { label: "Today’s registrations", value: 3 },
          { label: "Expiring memberships", value: 86 },
          { label: "Pending renewals", value: 12 },
          { label: "Today’s appointments", value: appointments.length },
          { label: "Sample collection today", value: rupees(6500) },
        ].map((m) => (
          <div key={m.label} className="summary-item">
            <span>{m.label}</span>
            <strong>{m.value}</strong>
          </div>
        ))}
      </div>
      <div className="quick-action-grid mb-6">
        <Button variant="ghost" asChild>
          <Link to="/members/new">
            <UsersRound />
            Add Member
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/memberships">
            <CreditCard />
            Create / renew membership
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/payments">
            <Plus />
            Record Payment
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/appointments">
            <CalendarDays />
            Book Appointment
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/members">
            <Search />
            Search Member
          </Link>
        </Button>
      </div>
      <div className="profile-detail-grid">
        <section>
          <h2>Renewal priorities</h2>
          {members
            .filter((m) => m.status === "Expiring")
            .slice(0, 4)
            .map((m) => (
              <Link
                key={m.id}
                to="/members/$memberId"
                params={{ memberId: m.id }}
                className="detail-row"
              >
                <strong>{m.name}</strong>
                <span>{formatCalendarDate(m.end)}</span>
              </Link>
            ))}
        </section>
        <section>
          <h2>Upcoming appointments</h2>
          {appointments.map((r) => (
            <div className="detail-row" key={r.id}>
              <strong>{r.name}</strong>
              <span>
                {r.time} · {r.trainer}
              </span>
            </div>
          ))}
          <Button className="mt-4" variant="outline" asChild>
            <Link to="/attendance">
              <ScanLine />
              View operational attendance
            </Link>
          </Button>
        </section>
      </div>
      <p className="workspace-footnote">
        Development staff preview · no sensitive administrative revenue or analytics · sample
        snapshot {formatCalendarDate(snapshotDate)}
      </p>
    </main>
  );
}
export function DashboardExtras() {
  const { members } = useWorkspace();
  return (
    <div className="dashboard pt-0">
      <div className="summary-grid">
        <div className="summary-item">
          <span>Monthly revenue · demo</span>
          <strong>{rupees(418500)}</strong>
        </div>
        <div className="summary-item">
          <span>Pending payments · sample</span>
          <strong>{rupees(4000)}</strong>
        </div>
        <div className="summary-item">
          <span>Sample recent registrations</span>
          <strong>{members.filter((m) => m.joined >= "2026-11-01").length}</strong>
        </div>
        <div className="summary-item">
          <span>Upcoming sessions · sample</span>
          <strong>{demoEntities.appointments.length}</strong>
        </div>
      </div>
      <div className="profile-detail-grid">
        <section>
          <h2>Recent registrations</h2>
          {members.slice(-3).map((m) => (
            <Link
              key={m.id}
              to="/members/$memberId"
              params={{ memberId: m.id }}
              className="detail-row"
            >
              <strong>{m.name}</strong>
              <span>{formatCalendarDate(m.joined)}</span>
            </Link>
          ))}
        </section>
        <section>
          <h2>Pending payments</h2>
          {demoEntities.payments
            .filter((p) => p.status === "Pending")
            .map((p) => (
              <div className="detail-row" key={p.id}>
                <strong>{p.name}</strong>
                <span>{rupees(p.amount)}</span>
              </div>
            ))}
          <Button variant="outline" asChild className="mt-4">
            <Link to="/payments">Payment records</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
