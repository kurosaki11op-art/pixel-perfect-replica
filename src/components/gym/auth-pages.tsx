import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Dumbbell, ArrowRight, ShieldCheck, UsersRound, Eye, EyeOff, LogOut } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspace } from "./workspace-provider";
import { loginSchema } from "@/lib/gym/validation";
import type { Role } from "@/lib/gym/domain";
export function AuthPage({
  kind,
}: {
  kind: "admin" | "staff" | "forgot" | "reset" | "expired" | "unauthorized" | "disabled";
}) {
  const { enterPreview, logout, session } = useWorkspace();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const login = kind === "admin" || kind === "staff";
  const title = login
    ? kind === "admin"
      ? "Admin sign in"
      : "Staff sign in"
    : {
        forgot: "Forgot password",
        reset: "Reset password",
        expired: "Your session has expired",
        unauthorized: "Access not permitted",
        disabled: "Account disabled",
      }[kind];
  async function preview(role: Role) {
    setBusy(true);
    try {
      await enterPreview(role);
      await navigate({ to: "/" });
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-page">
      <Link to="/" className="auth-brand">
        <div className="brand-mark">
          <Dumbbell />
        </div>
        <div>
          <strong>BELIEVER GYM</strong>
          <span>UNISEX GYM</span>
        </div>
      </Link>
      <div className="auth-layout">
        <div className="auth-intro">
          <span className="workspace-eyebrow">THE BELIEVER WORKSPACE</span>
          <h1>
            Stronger together.
            <br />
            Better every day.
          </h1>
          <p>One workspace for your members, your team, and the day ahead.</p>
          <div className="auth-role-mark">
            {kind === "staff" ? <UsersRound size={42} /> : <ShieldCheck size={42} />}
          </div>
        </div>
        <section className="auth-form-panel">
          <span className="demo-badge">Development adapter · not real authentication</span>
          <h2>{title}</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {login
              ? "Production sign-in is not connected. Use the clearly labeled preview below."
              : kind === "forgot"
                ? "Recovery email delivery is not connected."
                : kind === "reset"
                  ? "Password changes require a verified recovery session from the backend."
                  : kind === "unauthorized"
                    ? "Your preview role cannot open this section."
                    : kind === "disabled"
                      ? "Contact your gym administrator to restore access."
                      : "Sign in again to continue your work."}
          </p>
          {(login || kind === "forgot" || kind === "reset") && (
            <form
              className="demo-form mt-6"
              onSubmit={(e) => {
                e.preventDefault();
                setError("");
                const data = Object.fromEntries(new FormData(e.currentTarget));
                const schema = login
                  ? loginSchema
                  : kind === "forgot"
                    ? z.object({ email: z.string().email() })
                    : z
                        .object({ password: z.string().min(8), confirm: z.string() })
                        .refine((d) => d.password === d.confirm, {
                          message: "Passwords must match",
                        });
                const parsed = schema.safeParse(data);
                if (!parsed.success) {
                  setError(parsed.error.issues[0]?.message ?? "Check your entries");
                  return;
                }
                setNotice(
                  login
                    ? "Production sign-in is unavailable. No credentials were sent or stored."
                    : kind === "forgot"
                      ? "No email was sent. Recovery needs a connected authentication provider."
                      : "No password was changed. A verified recovery session is required.",
                );
              }}
            >
              {kind !== "reset" && (
                <label>
                  Email address
                  <Input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                  />
                </label>
              )}
              {(login || kind === "reset") && (
                <label>
                  {kind === "reset" ? "New password" : "Password"}
                  <div className="relative">
                    <Input
                      name="password"
                      type={show ? "text" : "password"}
                      autoComplete={login ? "current-password" : "new-password"}
                      placeholder="At least 8 characters"
                      required
                      minLength={8}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={show ? "Hide password" : "Show password"}
                      onClick={() => setShow(!show)}
                      className="absolute right-0 top-0"
                    >
                      {show ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                </label>
              )}
              {kind === "reset" && (
                <label>
                  Confirm password
                  <Input
                    name="confirm"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </label>
              )}
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              {notice && (
                <p role="status" className="preview-notice">
                  {notice}
                </p>
              )}
              <Button type="submit">
                {login
                  ? "Check sign-in form"
                  : kind === "forgot"
                    ? "Check recovery request"
                    : "Check password form"}
                <ArrowRight />
              </Button>
              {login && (
                <Link to="/forgot-password" className="text-xs text-muted-foreground">
                  Forgot password?
                </Link>
              )}
            </form>
          )}
          {login && (
            <>
              <div className="auth-separator">DEVELOPMENT PREVIEW</div>
              <Button
                variant="outline"
                className="w-full"
                disabled={busy}
                onClick={() => preview(kind)}
              >
                {busy ? "Opening preview..." : `Enter ${kind} demo workspace`}
                <ArrowRight />
              </Button>
              <p className="mt-4 text-center text-xs text-subtle">
                {kind === "admin" ? (
                  <Link to="/staff-login">Staff sign in</Link>
                ) : (
                  <Link to="/admin-login">Admin sign in</Link>
                )}
              </p>
            </>
          )}
          {!login && (
            <div className="mt-6 flex flex-wrap gap-3">
              {kind === "unauthorized" && session ? (
                <Button asChild>
                  <Link to="/">Back to dashboard</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/admin-login">Admin sign in</Link>
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link to="/staff-login">Staff sign in</Link>
              </Button>
              {session && (
                <Button
                  variant="ghost"
                  onClick={async () => {
                    await logout();
                    await navigate({ to: "/admin-login" });
                  }}
                >
                  <LogOut />
                  Leave preview
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
      <footer className="auth-footer">
        Believer Gym · Unisex Gym · Frontend development preview
      </footer>
    </main>
  );
}
