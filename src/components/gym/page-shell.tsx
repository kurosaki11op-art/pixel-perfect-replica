import { Link } from "@tanstack/react-router";
import { ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
export function PageShell({ title }: { title: string }) {
  return (
    <section className="dashboard">
      <div className="welcome">
        <div>
          <h1>{title}</h1>
          <p>Believer Gym · Unisex Gym</p>
        </div>
        <span className="demo-badge">Phase 1 preview</span>
      </div>
      <div className="empty-shell">
        <div className="metric-icon red">
          <Construction size={20} />
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          This section is reserved for the next phase.
          <br />
          No records or changes are saved in this preview.
        </p>
        <Button variant="outline" asChild>
          <Link to="/">
            <ArrowLeft />
            Back to dashboard
          </Link>
        </Button>
      </div>
    </section>
  );
}
