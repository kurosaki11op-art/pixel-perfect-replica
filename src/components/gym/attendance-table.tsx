import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { filterAttendance } from "@/lib/gym-data";
export function AttendanceTable() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const rows = filterAttendance(query, status);
  return (
    <section className="data-panel">
      <div className="panel-head">
        <div>
          <h2 className="panel-title">Live Attendance</h2>
          <p className="panel-description">Today's check-ins at a glance</p>
        </div>
        <span className="status-badge inside">Demo data</span>
      </div>
      <div className="table-tools">
        <div className="table-search">
          <Search size={13} className="absolute left-2.5 top-2 text-subtle" />
          <Input
            aria-label="Search attendance"
            placeholder="Search members..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <SlidersHorizontal size={12} className="ml-auto text-subtle" />
        <select
          aria-label="Filter attendance status"
          className="filter-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>All statuses</option>
          <option>Inside</option>
          <option>Checked out</option>
        </select>
      </div>
      <div className="attendance-scroll">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Check-in</th>
              <th>Membership plan</th>
              <th>Expiry</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((member, index) => (
              <tr key={member.id}>
                <td>
                  <div className="member-cell">
                    <div className={`member-avatar ${index % 2 === 0 ? "tint" : ""}`}>
                      {member.initials}
                    </div>
                    <div>
                      <div className="member-name">{member.name}</div>
                      <div className="mt-1 text-[9px] text-subtle">{member.id}</div>
                    </div>
                  </div>
                </td>
                <td>{member.time}</td>
                <td>{member.plan}</td>
                <td>{member.expiry}</td>
                <td>
                  <span className={`status-badge ${member.status === "Inside" ? "inside" : ""}`}>
                    {member.status}
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="h-36 text-center">
                  No members match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <span>Showing {rows.length} of 5 demo check-ins</span>
        <Button variant="ghost" asChild className="h-auto p-0 text-[10px] text-muted-foreground">
          <Link to="/attendance">
            View attendance
            <ArrowUpRight size={12} />
          </Link>
        </Button>
      </div>
    </section>
  );
}
