import { useState } from "react";
import { Save, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "./shared";
import { useWorkspace } from "./workspace-provider";
export function SettingsPage({ profile = false }: { profile?: boolean }) {
  const { session } = useWorkspace();
  const [tab, setTab] = useState(profile ? "Account" : "Gym information");
  const [notice, setNotice] = useState("");
  const [dirty, setDirty] = useState(false);
  const tabs = profile
    ? ["Account", "Notifications", "Preferences"]
    : ["Gym information", "Account", "Notifications", "Membership configuration", "Preferences"];
  return (
    <main className="dashboard">
      <PageHeader
        title={profile ? "My profile" : "Settings"}
        subtitle={
          profile
            ? "Your demo workspace identity and preferences."
            : "Gym information, membership configuration, and workspace preferences."
        }
      />
      <div className="workspace-tabs">
        {tabs.map((t) => (
          <Button
            key={t}
            variant="ghost"
            aria-pressed={tab === t}
            onClick={() => {
              if (dirty && !window.confirm("Discard unsaved preview preferences?")) return;
              setTab(t);
              setDirty(false);
              setNotice("");
            }}
          >
            {t}
          </Button>
        ))}
      </div>
      <form
        className="workspace-form max-w-3xl"
        onChange={() => {
          setDirty(true);
          setNotice("");
        }}
        onSubmit={(e) => {
          e.preventDefault();
          setDirty(false);
          setNotice(
            "Preferences reviewed locally. No application settings or profile data were saved.",
          );
        }}
      >
        <div className="form-section">
          <h2>{tab}</h2>
          {tab === "Gym information" ? (
            <div className="form-grid">
              <label>
                Gym name
                <Input defaultValue="Believer Gym" required />
              </label>
              <label>
                Gym category
                <Input defaultValue="Unisex Gym" required />
              </label>
              <label>
                Contact phone
                <Input type="tel" placeholder="Not connected" />
              </label>
              <label>
                Contact email
                <Input type="email" placeholder="Not connected" />
              </label>
              <label className="col-span-full">
                Address
                <textarea className="workspace-textarea" placeholder="Enter gym address" />
              </label>
            </div>
          ) : tab === "Account" ? (
            <>
              <div className="flex items-center gap-4 mb-6">
                <span className="member-avatar tint">
                  <UserRound />
                </span>
                <div>
                  <h3 className="font-semibold">{session?.name}</h3>
                  <p className="text-xs text-subtle">{session?.role} · Development identity</p>
                </div>
              </div>
              <div className="form-grid">
                <label>
                  Display name
                  <Input defaultValue={session?.name} required />
                </label>
                <label>
                  Profile email
                  <Input type="email" placeholder="name@example.com" />
                </label>
              </div>
              <p className="mt-5 text-xs text-subtle">
                Real profile storage, avatars, roles, and preferences will be connected during
                backend integration. Role changes are not available here.
              </p>
            </>
          ) : tab === "Membership configuration" ? (
            <div className="grid gap-5">
              <label>
                Expiry warning window
                <Input type="number" min={1} defaultValue={7} />
              </label>
              <label>
                Automatic checkout period (hours)
                <Input type="number" min={1} defaultValue={2} />
              </label>
              <p className="preview-notice">
                Existing two-hour automatic checkout and expiry restrictions must be enforced by the
                backend. These fields do not change operational behavior.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {(tab === "Notifications"
                ? ["Membership renewal reminders", "Appointment updates", "Attendance alerts"]
                : ["Compact table density", "Reduced animations", "Weekly activity summary"]
              ).map((label) => (
                <div className="detail-row" key={label}>
                  <span>{label}</span>
                  <Switch
                    aria-label={label}
                    defaultChecked
                    onCheckedChange={() => setDirty(true)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        {notice && (
          <p role="status" className="preview-notice">
            {notice}
          </p>
        )}
        <div className="form-actions">
          <span className="text-xs text-subtle">
            {dirty ? "Unsaved preview changes" : "Demo-only preferences"}
          </span>
          <Button type="submit">
            <Save />
            Review preferences
          </Button>
        </div>
      </form>
    </main>
  );
}
