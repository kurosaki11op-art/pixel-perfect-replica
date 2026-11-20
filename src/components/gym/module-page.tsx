import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  RotateCcw,
  ReceiptText,
  Printer,
  Download,
  CalendarDays,
  List,
  ChevronLeft,
  ChevronRight,
  Power,
  AlertTriangle,
} from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  DataTable,
  PageHeader,
  StatusBadge,
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  exportCsv,
  type Column,
} from "./shared";
import { api } from "@/lib/gym/api";
import { modules } from "@/lib/gym/modules";
import { snapshotDate, demoEntities } from "@/lib/gym/demo-data";
import { calendarDate, formatCalendarDate, rupees, remainingDays } from "@/lib/gym/dates";
import { membershipSchema, paymentSchema, phoneSchema, normalizeError } from "@/lib/gym/validation";
import type { EntityRecord } from "@/lib/gym/domain";
import { useWorkspace } from "./workspace-provider";
import { can } from "@/lib/gym/permissions";

export function ModulePage({ module, readOnly = false }: { module: string; readOnly?: boolean }) {
  const config = modules[module];
  const { session, members } = useWorkspace();
  const [rows, setRows] = useState<EntityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState<string | null>(null);
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [detail, setDetail] = useState<EntityRecord | null>(null);
  const [editing, setEditing] = useState<EntityRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [discard, setDiscard] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [receipt, setReceipt] = useState<EntityRecord | null>(null);
  const [view, setView] = useState("List");
  const [calendarMode, setCalendarMode] = useState("Month");
  const [calendarFocus, setCalendarFocus] = useState(snapshotDate);
  const [subtab, setSubtab] = useState("Plans");
  const kind = module === "plans" && subtab === "Offers" ? "offers" : config?.kind;
  const actualConfig = module === "plans" && subtab === "Offers" ? modules["offers"] : config;
  const load = useCallback(async () => {
    if (!kind) return;
    setLoading(true);
    setFailure(null);
    try {
      setRows(await api.list(kind));
    } catch (e) {
      setFailure(normalizeError(e).message);
    } finally {
      setLoading(false);
    }
  }, [kind]);
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  if (!config || !actualConfig) return <EmptyState title="Section unavailable" />;
  const allowed =
    !readOnly &&
    !!session &&
    (!actualConfig.permission || can(session.role, actualConfig.permission));
  const columns: Column<EntityRecord>[] = actualConfig.columns.map((c) => ({
    key: c.key,
    label: c.label,
    value: (r) => r[c.key] ?? "—",
    render:
      c.format === "money"
        ? (r) => rupees(r[c.key])
        : c.format === "date"
          ? (r) => formatCalendarDate(String(r[c.key]))
          : c.format === "status"
            ? (r) => <StatusBadge value={String(r[c.key])} />
            : undefined,
  }));
  const statuses = Array.from(new Set(rows.map((r) => r.status)));
  const categories = Array.from(
    new Set(rows.map((r) => String(r.category ?? r.type ?? "")).filter(Boolean)),
  );
  const filtered = rows.filter(
    (r) =>
      (status === "All" || r.status === status) &&
      (category === "All" || String(r.category ?? r.type) === category),
  );
  function openForm(record?: EntityRecord, renew = false) {
    setEditing(
      record
        ? {
            ...record,
            ...(renew ? { start: "", end: "", status: "Upcoming", payment: "Pending" } : {}),
          }
        : null,
    );
    setFormOpen(true);
    setErrors({});
    setNotice("");
    setDirty(false);
  }
  function closeForm() {
    if (dirty) setDiscard(true);
    else setFormOpen(false);
  }
  function changeMonth(direction: number) {
    const [y, m, d] = calendarFocus.split("-").map(Number);
    const current = new Date(Date.UTC(y ?? 2026, (m ?? 11) - 1, d ?? 20));
    if (calendarMode === "Month") current.setUTCMonth(current.getUTCMonth() + direction);
    else current.setUTCDate(current.getUTCDate() + direction * (calendarMode === "Week" ? 7 : 1));
    setCalendarFocus(current.toISOString().slice(0, 10));
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || !allowed || !config) return;
    const values = Object.fromEntries(new FormData(e.currentTarget).entries());
    const checks: Record<string, string> = {};
    for (const field of actualConfig?.fields ?? []) {
      const val = String(values[field.key] ?? "");
      if (field.required && !val.trim()) checks[field.key] = `${field.label} is required`;
      if (field.type === "date" && val && !calendarDate.safeParse(val).success)
        checks[field.key] = "Choose a valid calendar date";
      if (field.type === "number" && (!Number.isFinite(Number(val)) || Number(val) <= 0))
        checks[field.key] = "Enter an amount greater than zero";
      if (field.type === "email" && !z.string().email().safeParse(val).success)
        checks[field.key] = "Enter a valid email";
      if (field.type === "tel" && !phoneSchema.safeParse(val).success)
        checks[field.key] = "Enter a valid phone number";
    }
    if (kind === "memberships") {
      const parsed = membershipSchema.safeParse(values);
      if (!parsed.success)
        parsed.error.issues.forEach((i) => {
          checks[String(i.path[0])] = i.message;
        });
    }
    if (kind === "payments") {
      const parsed = paymentSchema.safeParse(values);
      if (!parsed.success)
        parsed.error.issues.forEach((i) => {
          checks[String(i.path[0])] = i.message;
        });
    }
    if (values["end"] && String(values["end"]) < String(values["start"] ?? values["date"] ?? ""))
      checks["end"] = "End date cannot precede the start date";
    if (
      (kind === "memberships" || kind === "payments" || kind === "appointments") &&
      !members.some((m) => m.name === values["name"])
    )
      checks["name"] = "Choose a member from the demo workspace";
    if (kind === "payments" && !demoEntities.memberships.some((m) => m.id === values["membership"]))
      checks["membership"] = "Select a valid demonstration membership";
    if (Object.keys(checks).length) {
      setErrors(checks);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const record = {
        ...editing,
        ...values,
        id: editing?.id ?? `DEMO-${kind}-${rows.length + 1}`,
        name: String(values["name"] ?? ""),
        date: String(values["date"] ?? values["start"] ?? editing?.date ?? snapshotDate),
        status: String(values["status"] ?? editing?.status ?? "Preview"),
        ...(values["amount"] ? { amount: Number(values["amount"]) } : {}),
      } as EntityRecord;
      const duplicate =
        kind === "appointments" &&
        rows.some(
          (r) =>
            r.id !== record.id &&
            r.date === record.date &&
            r.time === record.time &&
            r.trainer === record.trainer,
        );
      if (duplicate) {
        setErrors({ time: "This trainer already has a demo appointment at that time." });
        return;
      }
      const result = await api.preview(kind ?? config.kind, record);
      setRows((current) =>
        current.some((r) => r.id === record.id)
          ? current.map((r) => (r.id === record.id ? result.data : r))
          : [result.data, ...current],
      );
      setDirty(false);
      setNotice(
        kind === "payments"
          ? "Payment preview added locally. No transaction was processed and no money was collected."
          : "Applied to the in-memory preview only. No backend record was saved.",
      );
    } catch (e) {
      setNotice(normalizeError(e).message);
    } finally {
      setBusy(false);
    }
  }
  const amountTotal = rows.reduce((sum, r) => sum + Number(r.amount ?? 0), 0);
  return (
    <main className="dashboard">
      <PageHeader title={readOnly ? "Plans" : config.title} subtitle={config.subtitle}>
        {allowed && actualConfig.action && (
          <Button onClick={() => openForm()}>
            <Plus />
            {actualConfig.action}
          </Button>
        )}
      </PageHeader>
      {module === "plans" && (
        <div className="workspace-tabs">
          {["Plans", "Offers"].map((t) => (
            <Button
              variant="ghost"
              key={t}
              aria-pressed={subtab === t}
              onClick={() => {
                setSubtab(t);
                setStatus("All");
              }}
            >
              {t}
            </Button>
          ))}
          {readOnly && <span className="ml-auto text-xs text-subtle">View-only access</span>}
        </div>
      )}
      <div className="summary-grid">
        <div className="summary-item">
          <span>Sample {config.title.toLowerCase()}</span>
          <strong>{rows.length}</strong>
        </div>
        <div className="summary-item">
          <span>
            {module === "attendance"
              ? "Members inside"
              : module === "payments"
                ? "Pending collection"
                : "Active / scheduled"}
          </span>
          <strong>
            {module === "payments"
              ? rupees(
                  rows
                    .filter((r) => r.status === "Pending")
                    .reduce((s, r) => s + Number(r.amount ?? 0), 0),
                )
              : rows.filter((r) =>
                  ["Active", "Inside", "Scheduled", "Confirmed", "Enabled"].includes(r.status),
                ).length}
          </strong>
        </div>
        <div className="summary-item">
          <span>
            {["payments", "expenses", "plans"].includes(module)
              ? "Illustrative amount"
              : module === "attendance"
                ? "Today’s check-ins"
                : "Preview snapshot"}
          </span>
          <strong className="summary-small">
            {["payments", "expenses", "plans"].includes(module)
              ? rupees(amountTotal)
              : module === "attendance"
                ? rows.filter((r) => r.date === snapshotDate).length
                : formatCalendarDate(snapshotDate)}
          </strong>
        </div>
        <div className="summary-item">
          <span>Connection status</span>
          <strong className="summary-small">Not connected</strong>
        </div>
      </div>
      {module === "attendance" && (
        <p className="preview-notice mb-5">
          Automatic checkout: configured two-hour period. Expired memberships require restriction
          checks from the backend. No manual checkout is available.
        </p>
      )}
      {module === "automations" && (
        <p className="preview-notice mb-5">
          No automation runs from this preview. Execution history and error delivery require backend
          jobs.
        </p>
      )}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {module === "appointments" && (
          <>
            <div className="period-switch">
              <Button
                variant="ghost"
                aria-pressed={view === "List"}
                onClick={() => setView("List")}
              >
                <List />
                List
              </Button>
              <Button
                variant="ghost"
                aria-pressed={view === "Calendar"}
                onClick={() => setView("Calendar")}
              >
                <CalendarDays />
                Calendar
              </Button>
            </div>
            {view === "Calendar" && (
              <>
                <select
                  className="workspace-select"
                  aria-label="Calendar view"
                  value={calendarMode}
                  onChange={(e) => setCalendarMode(e.target.value)}
                >
                  {["Day", "Week", "Month"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Previous calendar period"
                  onClick={() => changeMonth(-1)}
                >
                  <ChevronLeft />
                </Button>
                <span className="text-sm">{formatCalendarDate(calendarFocus)}</span>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Next calendar period"
                  onClick={() => changeMonth(1)}
                >
                  <ChevronRight />
                </Button>
              </>
            )}
          </>
        )}
        {categories.length > 0 && (
          <select
            aria-label="Filter category"
            className="workspace-select ml-auto"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        )}
      </div>
      {loading ? (
        <LoadingSkeleton />
      ) : failure ? (
        <ErrorState message={failure} retry={load} />
      ) : view === "Calendar" ? (
        <AppointmentCalendar
          rows={filtered}
          focus={calendarFocus}
          mode={calendarMode}
          onOpen={setDetail}
        />
      ) : (
        <DataTable
          rows={filtered}
          columns={columns}
          searchKeys={(r) => Object.values(r).join(" ")}
          dateKey={module === "plans" ? undefined : (r) => r.date}
          filters={statuses}
          filterValue={status}
          onFilterChange={setStatus}
          onOpen={setDetail}
          actions={(r) => (
            <>
              {allowed && actualConfig.fields.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  title="Edit preview"
                  aria-label={`Edit ${r.name}`}
                  onClick={() => openForm(r)}
                >
                  <Pencil />
                </Button>
              )}
              {module === "memberships" && allowed && (
                <Button
                  variant="ghost"
                  size="icon"
                  title="Renew membership"
                  aria-label={`Renew ${r.name}`}
                  onClick={() => openForm(r, true)}
                >
                  <RotateCcw />
                </Button>
              )}
              {module === "payments" && (
                <Button
                  variant="ghost"
                  size="icon"
                  title="Receipt preview"
                  aria-label={`Receipt ${r.id}`}
                  onClick={() => setReceipt(r)}
                >
                  <ReceiptText />
                </Button>
              )}
            </>
          )}
        />
      )}
      <Dialog
        open={!!detail}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogTitle>{detail?.name}</DialogTitle>
          <DialogDescription>{config.title} · demonstration record</DialogDescription>
          {detail &&
            Object.entries(detail).map(([key, value]) => (
              <div className="detail-row" key={key}>
                <span>{key.replace(/([A-Z])/g, " $1")}</span>
                <strong>
                  {key === "amount"
                    ? rupees(value)
                    : ["date", "start", "end"].includes(key)
                      ? formatCalendarDate(String(value))
                      : String(value)}
                </strong>
              </div>
            ))}
          {detail && module === "memberships" && (
            <p className="preview-notice">
              {remainingDays(String(detail.end), snapshotDate)} days remaining in the sample
              snapshot. Duration and renewal rules await verification.
            </p>
          )}
          {module === "staff" && detail && (
            <>
              <h3 className="mt-4 font-medium">Staff activity overview</h3>
              <p className="text-xs text-subtle">No verified staff activity data connected.</p>
            </>
          )}
          {module === "automations" && (
            <>
              <h3 className="mt-4 font-medium">Execution history</h3>
              <EmptyState
                title="No execution history"
                description="Backend jobs are not connected."
              />
            </>
          )}
          {detail && allowed && actualConfig.fields.length > 0 && (
            <Button
              onClick={() => {
                openForm(detail);
                setDetail(null);
              }}
            >
              <Pencil />
              Edit preview
            </Button>
          )}
          {detail && allowed && ["plans", "staff"].includes(module) && (
            <Button
              variant="outline"
              onClick={() => {
                const next =
                  module === "staff"
                    ? detail.status === "Enabled"
                      ? "Disabled"
                      : "Enabled"
                    : detail.status === "Active"
                      ? "Inactive"
                      : "Active";
                setRows((rs) => rs.map((r) => (r.id === detail.id ? { ...r, status: next } : r)));
                setDetail({ ...detail, status: next });
              }}
            >
              <Power />
              {detail.status === "Enabled" || detail.status === "Active"
                ? "Disable in preview"
                : "Enable in preview"}
            </Button>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
      >
        <DialogContent className="max-h-[88vh] max-w-xl overflow-y-auto">
          <DialogTitle>{editing ? "Edit / renew preview" : actualConfig.action}</DialogTitle>
          <DialogDescription>
            Demonstration only. No backend writes, account creation, transactions, or automation
            execution.
          </DialogDescription>
          <form
            key={`${editing?.id ?? "new"}-${formOpen}`}
            className="demo-form"
            onChange={() => {
              setDirty(true);
              setNotice("");
            }}
            onSubmit={submit}
          >
            <div className="form-grid">
              {actualConfig.fields.map((field) => (
                <label key={field.key}>
                  {field.label}
                  {field.options ? (
                    <select
                      aria-label={field.label}
                      name={field.key}
                      className="workspace-select"
                      defaultValue={String(editing?.[field.key] ?? field.options[0])}
                    >
                      {field.options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  ) : field.key === "name" &&
                    ["memberships", "payments", "appointments"].includes(module) ? (
                    <select
                      aria-label={field.label}
                      name="name"
                      className="workspace-select"
                      defaultValue={String(editing?.name ?? "")}
                      required
                    >
                      <option value="">Select member</option>
                      {members.map((m) => (
                        <option key={m.id}>{m.name}</option>
                      ))}
                    </select>
                  ) : field.key === "membership" ? (
                    <select
                      aria-label={field.label}
                      name="membership"
                      className="workspace-select"
                      defaultValue={String(editing?.membership ?? "")}
                      required
                    >
                      <option value="">Select membership</option>
                      {demoEntities.memberships.map((m) => (
                        <option value={m.id} key={m.id}>
                          {m.id} · {m.name}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      name={field.key}
                      className="workspace-textarea"
                      defaultValue={String(editing?.[field.key] ?? "")}
                    />
                  ) : (
                    <Input
                      aria-label={field.label}
                      name={field.key}
                      type={field.type ?? "text"}
                      required={field.required}
                      min={field.type === "number" ? 0.01 : undefined}
                      step={field.type === "number" ? ".01" : undefined}
                      defaultValue={String(editing?.[field.key] ?? "")}
                    />
                  )}{" "}
                  {errors[field.key] && (
                    <span role="alert" className="form-error">
                      {errors[field.key]}
                    </span>
                  )}
                </label>
              ))}
            </div>
            {notice && (
              <p role="status" className="preview-notice">
                {notice}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeForm}>
                {notice ? "Done" : "Cancel"}
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Preparing..." : "Apply to preview"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={discard} onOpenChange={setDiscard}>
        <DialogContent>
          <DialogTitle>Discard unsaved changes?</DialogTitle>
          <DialogDescription>Your changes have not been applied to the preview.</DialogDescription>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDiscard(false)}>
              Keep editing
            </Button>
            <Button
              onClick={() => {
                setDiscard(false);
                setFormOpen(false);
                setDirty(false);
              }}
            >
              Discard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!receipt}
        onOpenChange={(open) => {
          if (!open) setReceipt(null);
        }}
      >
        <DialogContent>
          <DialogTitle>Receipt preview</DialogTitle>
          <DialogDescription>Sample only · not proof of payment</DialogDescription>
          <div className="receipt-preview">
            <strong>BELIEVER GYM · UNISEX GYM</strong>
            <span>DEMONSTRATION RECEIPT</span>
            <h2>{rupees(receipt?.amount ?? 0)}</h2>
            {receipt &&
              [
                ["Receipt", receipt.id],
                ["Member", receipt.name],
                ["Membership", receipt.membership],
                ["Date", formatCalendarDate(receipt.date)],
                ["Method", receipt.method],
                ["Status", receipt.status],
              ].map(([k, v]) => (
                <div className="detail-row" key={k}>
                  <span>{k}</span>
                  <strong>{v}</strong>
                </div>
              ))}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer />
              Print preview
            </Button>
            <Button onClick={() => receipt && exportCsv([receipt], "demo-receipt.csv")}>
              <Download />
              Export sample
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <p className="workspace-footnote">
        <AlertTriangle size={12} />
        Sample values are illustrative. No production data, pricing, or security guarantees are
        implied.
      </p>
    </main>
  );
}
function AppointmentCalendar({
  rows,
  focus,
  mode,
  onOpen,
}: {
  rows: EntityRecord[];
  focus: string;
  mode: string;
  onOpen: (r: EntityRecord) => void;
}) {
  const [year, month, day] = focus.split("-").map(Number);
  const first = new Date(
    Date.UTC(year ?? 2026, (month ?? 11) - 1, mode === "Month" ? 1 : (day ?? 20)),
  );
  const count =
    mode === "Month"
      ? new Date(Date.UTC(year ?? 2026, month ?? 11, 0)).getUTCDate()
      : mode === "Week"
        ? 7
        : 1;
  return (
    <div className={`appointment-calendar ${mode === "Day" ? "day-view" : ""}`}>
      {Array.from({ length: count }, (_, i) => {
        const d = new Date(first);
        d.setUTCDate(first.getUTCDate() + i);
        const key = d.toISOString().slice(0, 10);
        const items = rows.filter((r) => r.date === key);
        return (
          <div className="calendar-day" key={key}>
            <span>{formatCalendarDate(key)}</span>
            {items.map((r) => (
              <Button key={r.id} variant="ghost" onClick={() => onOpen(r)}>
                <strong>
                  {r.time} · {r.name}
                </strong>
                <span>{r.trainer}</span>
              </Button>
            ))}
          </div>
        );
      })}
    </div>
  );
}
