import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  UserRound,
  Camera,
  CreditCard,
  CalendarDays,
} from "lucide-react";
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
  type Column,
} from "./shared";
import { useWorkspace } from "./workspace-provider";
import { can } from "@/lib/gym/permissions";
import { planOptions, snapshotDate, demoEntities } from "@/lib/gym/demo-data";
import { memberSchema } from "@/lib/gym/validation";
import { formatCalendarDate, rupees } from "@/lib/gym/dates";
import type { Member } from "@/lib/gym/domain";
export function MembersPage() {
  const { members, session, loading, error, reload } = useWorkspace();
  const [status, setStatus] = useState("All");
  const [deleting, setDeleting] = useState<Member | null>(null);
  const navigate = useNavigate();
  const cols: Column<Member>[] = [
    {
      key: "name",
      label: "Member",
      value: (m) => m.name,
      render: (m) => (
        <div className="member-cell">
          <span className="member-avatar tint">
            {m.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div>
            <strong>{m.name}</strong>
            <small>{m.id}</small>
          </div>
        </div>
      ),
    },
    { key: "phone", label: "Contact", value: (m) => m.phone },
    { key: "plan", label: "Membership", value: (m) => m.plan },
    {
      key: "joined",
      label: "Joined",
      value: (m) => m.joined,
      render: (m) => formatCalendarDate(m.joined),
    },
    { key: "end", label: "Expiry", value: (m) => m.end, render: (m) => formatCalendarDate(m.end) },
    {
      key: "status",
      label: "Status",
      value: (m) => m.status,
      render: (m) => <StatusBadge value={m.status} />,
    },
  ];
  return (
    <main className="dashboard">
      <PageHeader
        title="Members"
        subtitle="Your community, organized. Find, register, and manage every member."
      >
        <Button asChild>
          <Link to="/members/new">
            <Plus />
            Add Member
          </Link>
        </Button>
      </PageHeader>
      <div className="summary-grid">
        {[
          { label: "Sample members", value: members.length },
          { label: "Active", value: members.filter((m) => m.status === "Active").length },
          { label: "Expiring", value: members.filter((m) => m.status === "Expiring").length },
          { label: "Expired", value: members.filter((m) => m.status === "Expired").length },
        ].map((item) => (
          <div className="summary-item" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} retry={reload} />
      ) : (
        <DataTable
          rows={members.filter((m) => status === "All" || m.status === status)}
          columns={cols}
          searchKeys={(m) => `${m.name} ${m.phone} ${m.id}`}
          filters={["Active", "Expiring", "Expired"]}
          filterValue={status}
          onFilterChange={setStatus}
          onOpen={(m) => navigate({ to: "/members/$memberId", params: { memberId: m.id } })}
          actions={(m) => (
            <>
              <Button
                variant="ghost"
                size="icon"
                title="Edit member"
                aria-label={`Edit ${m.name}`}
                asChild
              >
                <Link to="/members/$memberId/edit" params={{ memberId: m.id }}>
                  <Pencil />
                </Link>
              </Button>
              {session && can(session.role, "members.delete") && (
                <Button
                  variant="ghost"
                  size="icon"
                  title="Delete member"
                  aria-label={`Delete ${m.name}`}
                  onClick={() => setDeleting(m)}
                >
                  <Trash2 />
                </Button>
              )}
            </>
          )}
        />
      )}
      <Dialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <DialogContent>
          <DialogTitle>Delete {deleting?.name}?</DialogTitle>
          <DialogDescription>
            In production, deletion may affect membership, payment, and attendance records. Only
            Admin can request deletion. This preview will not delete any member.
          </DialogDescription>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button onClick={() => setDeleting(null)}>Acknowledge preview only</Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
export function MemberFormPage({ memberId }: { memberId?: string }) {
  const { members, previewMember } = useWorkspace();
  const navigate = useNavigate();
  const existing = members.find((m) => m.id === memberId);
  const [dirty, setDirty] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(
    () => () => {
      if (photo) URL.revokeObjectURL(photo);
    },
    [photo],
  );
  const defaults = existing ?? {
    id: `BG-DEMO-${members.length + 1}`,
    name: "",
    phone: "",
    email: "",
    category: "Adult",
    joined: "",
    emergencyName: "",
    emergencyPhone: "",
    status: "Active",
    plan: planOptions[0],
    start: "",
    end: "",
    notes: "",
  };
  if (memberId && !existing)
    return (
      <main className="dashboard">
        <EmptyState title="Member not found" />
        <Button asChild variant="outline">
          <Link to="/members">Back to members</Link>
        </Button>
      </main>
    );
  const fields = [
    { name: "name", label: "Full name", type: "text" },
    { name: "phone", label: "Phone number", type: "tel" },
    { name: "email", label: "Email address (optional)", type: "email" },
    { name: "joined", label: "Registration date", type: "date" },
    { name: "emergencyName", label: "Emergency contact name", type: "text" },
    { name: "emergencyPhone", label: "Emergency contact phone", type: "tel" },
    { name: "start", label: "Membership start date", type: "date" },
    { name: "end", label: "Membership end date", type: "date" },
  ];
  return (
    <main className="dashboard">
      <PageHeader
        title={existing ? "Edit member" : "Register member"}
        subtitle="Member details and membership dates stay exactly as selected."
      >
        <Button
          variant="outline"
          onClick={() => (dirty ? setConfirmLeave(true) : navigate({ to: "/members" }))}
        >
          <ArrowLeft />
          Back
        </Button>
      </PageHeader>
      <form
        className="workspace-form"
        onChange={() => {
          setDirty(true);
          setNotice("");
        }}
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          const form = new FormData(e.currentTarget);
          const input = { ...defaults, ...Object.fromEntries(form.entries()) };
          const parsed = memberSchema.safeParse(input);
          if (!parsed.success) {
            setErrors(
              Object.fromEntries(
                parsed.error.issues.map((i) => [String(i.path[0] ?? "form"), i.message]),
              ),
            );
            return;
          }
          setErrors({});
          setBusy(true);
          try {
            await previewMember(parsed.data);
            setDirty(false);
            setNotice(
              "Member updated in this in-memory preview only. Nothing was saved to a backend.",
            );
          } catch (error) {
            setNotice(error instanceof Error ? error.message : "Preview could not be updated.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="form-section">
          <h2>Personal & contact details</h2>
          <div className="photo-field">
            <div className="profile-photo">
              {photo ? <img src={photo} alt="Selected member photo" /> : <UserRound size={32} />}
            </div>
            <label className="photo-upload">
              <Camera size={16} />
              Choose optional photo
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 5 * 1024 * 1024) {
                    setPhotoError("Choose an image smaller than 5 MB.");
                    return;
                  }
                  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                    setPhotoError("Choose a JPEG, PNG, or WebP image.");
                    return;
                  }
                  setPhotoError("");
                  setPhoto(URL.createObjectURL(file));
                }}
              />
            </label>
            <span className="text-xs text-subtle">Local preview only · maximum 5 MB</span>
          </div>
          {photoError && (
            <p role="alert" className="form-error">
              {photoError}
            </p>
          )}
          <div className="form-grid">
            {fields.slice(0, 4).map((field) => (
              <label key={field.name}>
                {field.label}
                <Input
                  type={field.type}
                  name={field.name}
                  defaultValue={String(defaults[field.name as keyof typeof defaults] ?? "")}
                  required={field.name !== "email"}
                />
                {errors[field.name] && <span className="form-error">{errors[field.name]}</span>}
              </label>
            ))}
            <label>
              Member category
              <select name="category" className="workspace-select" defaultValue={defaults.category}>
                <option>Adult</option>
                <option>Kids</option>
              </select>
            </label>
          </div>
        </div>
        <div className="form-section">
          <h2>Emergency contact</h2>
          <div className="form-grid">
            {fields.slice(4, 6).map((field) => (
              <label key={field.name}>
                {field.label}
                <Input
                  name={field.name}
                  type={field.type}
                  defaultValue={String(defaults[field.name as keyof typeof defaults] ?? "")}
                  required
                />
                {errors[field.name] && <span className="form-error">{errors[field.name]}</span>}
              </label>
            ))}
          </div>
        </div>
        <div className="form-section">
          <h2>Membership details</h2>
          <div className="form-grid">
            <label>
              Membership plan
              <select name="plan" className="workspace-select" defaultValue={defaults.plan}>
                {planOptions.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
            <label>
              Membership status
              <select name="status" className="workspace-select" defaultValue={defaults.status}>
                {["Active", "Expiring", "Expired"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            {fields.slice(6).map((field) => (
              <label key={field.name}>
                {field.label}
                <Input
                  type="date"
                  name={field.name}
                  defaultValue={String(defaults[field.name as keyof typeof defaults] ?? "")}
                  required
                />
                {errors[field.name] && <span className="form-error">{errors[field.name]}</span>}
              </label>
            ))}
          </div>
          <label className="mt-5 grid gap-2 text-sm">
            Notes
            <textarea
              name="notes"
              defaultValue={defaults.notes}
              className="workspace-textarea"
              rows={3}
            />
          </label>
          <p className="mt-4 text-xs text-subtle">
            Plan pricing and expiry policies are illustrative until the existing backend is
            verified.
          </p>
        </div>
        {notice && (
          <p role="status" className="preview-notice">
            {notice}
          </p>
        )}
        <div className="form-actions">
          <span className="text-xs text-subtle">
            {dirty ? "Unsaved changes" : "No unsaved changes"}
          </span>
          <Button disabled={busy} type="submit">
            {busy
              ? "Preparing preview..."
              : existing
                ? "Apply edit to preview"
                : "Add to demo workspace"}
          </Button>
        </div>
      </form>
      <Dialog open={confirmLeave} onOpenChange={setConfirmLeave}>
        <DialogContent>
          <DialogTitle>Discard unsaved changes?</DialogTitle>
          <DialogDescription>Your edits have not been applied to the preview.</DialogDescription>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmLeave(false)}>
              Keep editing
            </Button>
            <Button onClick={() => navigate({ to: "/members" })}>Discard changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
export function MemberProfilePage({ memberId }: { memberId: string }) {
  const { members } = useWorkspace();
  const member = members.find((m) => m.id === memberId);
  const [tab, setTab] = useState("Overview");
  if (!member)
    return (
      <main className="dashboard">
        <EmptyState title="Member not found" />
      </main>
    );
  const payments = demoEntities.payments.filter((p) => p.name === member.name);
  const tabs = [
    "Overview",
    "Membership history",
    "Payments",
    "Attendance",
    "Appointments",
    "Notes",
  ];
  return (
    <main className="dashboard">
      <PageHeader
        title={member.name}
        subtitle={`${member.id} · Member since ${formatCalendarDate(member.joined)}`}
      >
        <Button asChild variant="outline">
          <Link to="/members">
            <ArrowLeft />
            Members
          </Link>
        </Button>
        <Button asChild>
          <Link to="/members/$memberId/edit" params={{ memberId }}>
            <Pencil />
            Edit member
          </Link>
        </Button>
      </PageHeader>
      <div className="member-overview">
        <div className="profile-photo">
          <UserRound size={40} />
        </div>
        <div>
          <h2>{member.name}</h2>
          <p>
            {member.phone} · {member.email || "No email provided"}
          </p>
          <StatusBadge value={member.status} />
        </div>
        <div className="ml-auto">
          <span className="text-xs text-subtle">Current membership</span>
          <h3 className="mt-2 font-semibold">{member.plan}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatCalendarDate(member.start)} — {formatCalendarDate(member.end)}
          </p>
        </div>
      </div>
      <div className="workspace-tabs">
        {tabs.map((t) => (
          <Button key={t} variant="ghost" aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t}
          </Button>
        ))}
      </div>
      {tab === "Overview" ? (
        <div className="profile-detail-grid">
          <section>
            <h2>Member details</h2>
            {[
              ["Category", member.category],
              ["Phone", member.phone],
              ["Email", member.email || "—"],
              ["Registered", formatCalendarDate(member.joined)],
            ].map(([k, v]) => (
              <div className="detail-row" key={k}>
                <span>{k}</span>
                <strong>{v}</strong>
              </div>
            ))}
          </section>
          <section>
            <h2>Emergency contact</h2>
            <div className="detail-row">
              <span>Name</span>
              <strong>{member.emergencyName}</strong>
            </div>
            <div className="detail-row">
              <span>Phone</span>
              <strong>{member.emergencyPhone}</strong>
            </div>
            <h2 className="mt-6">Membership</h2>
            <Button asChild variant="outline">
              <Link to="/memberships">
                <CreditCard />
                View memberships
              </Link>
            </Button>
          </section>
        </div>
      ) : tab === "Notes" ? (
        <section className="profile-notes">
          <h2>Member notes</h2>
          <p>{member.notes || "No notes on file."}</p>
          <Button variant="outline" asChild>
            <Link to="/members/$memberId/edit" params={{ memberId }}>
              <Pencil />
              Edit notes
            </Link>
          </Button>
        </section>
      ) : tab === "Payments" ? (
        <DataTable
          rows={payments}
          searchKeys={(r) => r.id + " " + r.status}
          columns={[
            { key: "id", label: "Payment", value: (r) => r.id },
            {
              key: "amount",
              label: "Amount",
              value: (r) => Number(r.amount),
              render: (r) => rupees(r.amount),
            },
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
          emptyTitle="No sample payments for this member"
        />
      ) : tab === "Membership history" ? (
        <DataTable
          rows={demoEntities.memberships.filter((r) => r.name === member.name)}
          searchKeys={(r) => r.name}
          columns={[
            { key: "plan", label: "Plan", value: (r) => r.plan ?? "—" },
            {
              key: "start",
              label: "Start date",
              value: (r) => String(r.start),
              render: (r) => formatCalendarDate(String(r.start)),
            },
            {
              key: "end",
              label: "End date",
              value: (r) => String(r.end),
              render: (r) => formatCalendarDate(String(r.end)),
            },
            {
              key: "status",
              label: "Status",
              value: (r) => r.status,
              render: (r) => <StatusBadge value={r.status} />,
            },
          ]}
        />
      ) : (
        <DataTable
          rows={demoEntities[tab === "Attendance" ? "attendance" : "appointments"].filter(
            (r) => r.name === member.name,
          )}
          searchKeys={(r) => r.name}
          columns={[
            {
              key: "date",
              label: "Date",
              value: (r) => r.date,
              render: (r) => formatCalendarDate(r.date),
            },
            { key: "time", label: "Time", value: (r) => r.time ?? r.checkIn ?? "—" },
            {
              key: "status",
              label: "Status",
              value: (r) => r.status,
              render: (r) => <StatusBadge value={r.status} />,
            },
          ]}
          emptyTitle={`No sample ${tab.toLowerCase()} for this member`}
        />
      )}
      <p className="workspace-footnote">
        <CalendarDays size={12} />
        Sample snapshot: {formatCalendarDate(snapshotDate)} · no backend records connected
      </p>
    </main>
  );
}
