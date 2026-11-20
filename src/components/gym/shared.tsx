import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Download,
  Search,
  X,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
export function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={`status-badge ${["Active", "Inside", "Paid", "Confirmed", "Enabled"].includes(value) ? "inside" : ""}`}
    >
      {value}
    </span>
  );
}
export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="workspace-header">
      <div>
        <span className="workspace-eyebrow">BELIEVER GYM · UNISEX</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="workspace-header-actions">
        <span className="demo-badge">Development preview</span>
        {children}
      </div>
    </div>
  );
}
export function EmptyState({
  title = "No records found",
  description = "Try changing your search or filters.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="workspace-empty">
      <Inbox size={28} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
export function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div className="workspace-empty">
      <h3>Unable to load records</h3>
      <p>{message}</p>
      <Button variant="outline" onClick={retry}>
        <RefreshCw />
        Try again
      </Button>
    </div>
  );
}
export function LoadingSkeleton() {
  return (
    <div role="status" aria-label="Loading records" className="grid gap-4 p-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 animate-pulse rounded-md bg-secondary" />
      ))}
    </div>
  );
}
export function exportCsv(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0] ?? {});
  const csv = [
    keys.join(","),
    ...rows.map((row) =>
      keys.map((k) => '"' + String(row[k] ?? "").replaceAll('"', '""') + '"').join(","),
    ),
  ].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
export type Column<T> = {
  key: string;
  label: string;
  value: (row: T) => string | number;
  render?: ((row: T) => ReactNode) | undefined;
};
export function paginate<T>(rows: T[], page: number, size: number) {
  return rows.slice((page - 1) * size, page * size);
}
export function DataTable<T extends { id: string }>({
  rows,
  columns,
  searchKeys,
  onOpen,
  actions,
  emptyTitle = "No records found",
  filterLabel = "Status",
  filters,
  filterValue,
  onFilterChange,
  dateKey,
}: {
  rows: T[];
  columns: Column<T>[];
  searchKeys: (row: T) => string;
  onOpen?: (row: T) => void;
  actions?: (row: T) => ReactNode;
  emptyTitle?: string;
  filterLabel?: string;
  filters?: string[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  dateKey?: ((row: T) => string) | undefined;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [sort, setSort] = useState({ key: columns[0]?.key ?? "", asc: true });
  const [hidden, setHidden] = useState<string[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const filtered = useMemo(() => {
    const col = columns.find((c) => c.key === sort.key);
    return rows
      .filter(
        (row) =>
          searchKeys(row).toLowerCase().includes(query.toLowerCase()) &&
          (!dateKey || ((!from || dateKey(row) >= from) && (!to || dateKey(row) <= to))),
      )
      .sort((a, b) => {
        const va = col?.value(a) ?? "",
          vb = col?.value(b) ?? "";
        const cmp =
          typeof va === "number" && typeof vb === "number"
            ? va - vb
            : String(va).localeCompare(String(vb), undefined, { numeric: true });
        return sort.asc ? cmp : -cmp;
      });
  }, [rows, query, sort, columns, searchKeys, dateKey, from, to]);
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const current = Math.min(page, pages);
  const visible = columns.filter((c) => !hidden.includes(c.key));
  return (
    <div className="workspace-table">
      <div className="workspace-table-toolbar">
        <div className="workspace-search">
          <Search size={15} />
          <Input
            aria-label="Search records"
            placeholder="Search name, ID, phone..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        {filters && (
          <select
            className="workspace-select"
            aria-label={`Filter ${filterLabel.toLowerCase()}`}
            value={filterValue}
            onChange={(e) => {
              onFilterChange?.(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All {filterLabel.toLowerCase()}</option>
            {filters.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        )}
        {dateKey && (
          <div className="date-range">
            <Input
              type="date"
              aria-label="From date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPage(1);
              }}
            />
            <span>—</span>
            <Input
              type="date"
              aria-label="To date"
              value={to}
              min={from}
              onChange={(e) => {
                setTo(e.target.value);
                setPage(1);
              }}
            />
          </div>
        )}
        {(query || from || to || (filterValue && filterValue !== "All")) && (
          <Button
            variant="ghost"
            size="icon"
            title="Clear filters"
            aria-label="Clear filters"
            onClick={() => {
              setQuery("");
              setFrom("");
              setTo("");
              onFilterChange?.("All");
              setPage(1);
            }}
          >
            <X />
          </Button>
        )}
        <div className="ml-auto flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" title="Columns" aria-label="Column visibility">
                <Columns3 />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columns.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.key}
                  checked={!hidden.includes(c.key)}
                  disabled={visible.length === 1 && !hidden.includes(c.key)}
                  onCheckedChange={(checked) =>
                    setHidden((h) => (checked ? h.filter((k) => k !== c.key) : [...h, c.key]))
                  }
                >
                  {c.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="icon"
            title="Export demo records"
            aria-label="Export demo records"
            disabled={!filtered.length}
            onClick={() =>
              exportCsv(
                filtered as unknown as Record<string, unknown>[],
                "believer-demo-records.csv",
              )
            }
          >
            <Download />
          </Button>
        </div>
      </div>
      <div className="workspace-table-scroll">
        <table>
          <thead>
            <tr>
              {visible.map((c) => (
                <th key={c.key}>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setSort((s) => ({ key: c.key, asc: s.key === c.key ? !s.asc : true }))
                    }
                    className="h-auto justify-start p-0 text-xs"
                  >
                    {c.label}
                    {sort.key === c.key ? (
                      sort.asc ? (
                        <ArrowUp size={11} />
                      ) : (
                        <ArrowDown size={11} />
                      )
                    ) : null}
                  </Button>
                </th>
              ))}
              {(actions || onOpen) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginate(filtered, current, size).map((row) => (
              <tr key={row.id}>
                {visible.map((c) => (
                  <td key={c.key}>{c.render ? c.render(row) : c.value(row)}</td>
                ))}
                {(actions || onOpen) && (
                  <td>
                    <div className="flex gap-1">
                      {onOpen && (
                        <Button variant="ghost" size="sm" onClick={() => onOpen(row)}>
                          Details
                          <ChevronRight />
                        </Button>
                      )}
                      {actions?.(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!filtered.length && <EmptyState title={emptyTitle} />}
      <div className="workspace-table-footer">
        <span>
          {filtered.length
            ? `${(current - 1) * size + 1}–${Math.min(current * size, filtered.length)}`
            : "0"}{" "}
          of {filtered.length} demo records
        </span>
        <div className="flex items-center gap-3">
          <select
            aria-label="Rows per page"
            className="workspace-select"
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous page"
            disabled={current === 1}
            onClick={() => setPage(current - 1)}
          >
            <ChevronLeft />
          </Button>
          <span>
            {current} / {pages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next page"
            disabled={current >= pages}
            onClick={() => setPage(current + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
