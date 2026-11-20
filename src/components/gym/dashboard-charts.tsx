import { useState } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { revenueData, membershipData, type Period } from "@/lib/gym-data";
const currency = (value: number) => "₹" + value.toLocaleString("en-IN");
export function DashboardCharts() {
  const [period, setPeriod] = useState<Period>("Weekly");
  const total = revenueData[period].reduce((sum, row) => sum + row.revenue, 0);
  const previous = revenueData[period].reduce((sum, row) => sum + row.previous, 0);
  const increase = ((total / previous - 1) * 100).toFixed(1);
  return (
    <div className="analytics-grid">
      <section className="data-panel">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Revenue Analytics</h2>
            <p className="panel-description">A closer look at your gym's performance</p>
          </div>
          <div className="period-switch" aria-label="Revenue period">
            {(["Daily", "Weekly", "Monthly"] as Period[]).map((value) => (
              <Button
                key={value}
                variant="ghost"
                aria-pressed={period === value}
                onClick={() => setPeriod(value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>
        <div className="revenue-summary">
          <strong aria-label="Period revenue">{currency(total)}</strong>
          <span className="demo-badge">
            <TrendingUp size={11} />+{increase}%
          </span>
          <span className="text-[9px] text-subtle">vs. previous period</span>
        </div>
        <div className="chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueData[period]}
              margin={{ top: 15, right: 12, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 5" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--subtle)", fontSize: 9 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--subtle)", fontSize: 9 }}
                tickFormatter={(value) => "₹" + value / 1000 + "k"}
                width={47}
              />
              <Tooltip
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="rounded-md border border-border bg-popover p-3 text-xs shadow-md">
                      <p className="mb-2 text-subtle">{label}</p>
                      {payload.map((item) => (
                        <p key={item.dataKey} className="my-1">
                          {item.dataKey === "revenue" ? "Revenue" : "Previous"}:{" "}
                          {currency(Number(item.value))}
                        </p>
                      ))}
                    </div>
                  ) : null
                }
              />
              <Area
                type="monotone"
                dataKey="previous"
                stroke="var(--subtle)"
                strokeDasharray="4 5"
                fill="transparent"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                fill="url(#revenueFill)"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-footer">
          <span className="chart-legend">
            Revenue
            <span className="ml-3 border-t border-dashed border-subtle w-3" />
            Previous period
          </span>
          <span>Demonstration data</span>
        </div>
      </section>
      <section className="data-panel">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Membership Overview</h2>
            <p className="panel-description">Every member, accounted for</p>
          </div>
          <MoreHorizontal size={16} className="text-subtle" />
        </div>
        <div className="donut-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={membershipData}
                innerRadius={64}
                outerRadius={82}
                paddingAngle={4}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
                cornerRadius={4}
              >
                {membershipData.map((item) => (
                  <Cell key={item.name} fill={item.fill} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) =>
                  active && payload?.length ? (
                    <div className="rounded-md border border-border bg-popover p-3 text-xs">
                      {payload[0]?.name}: {payload[0]?.value}
                    </div>
                  ) : null
                }
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-center">
            <strong>1,248</strong>
            <span>Total members</span>
          </div>
        </div>
        <div className="membership-legend">
          {membershipData.map((item, index) => (
            <div className="legend-row" key={item.name}>
              <span
                className={`legend-dot ${index === 1 ? "expiring" : index === 2 ? "expired" : ""}`}
              />
              <span>{item.name}</span>
              <strong>{item.value.toLocaleString("en-IN")}</strong>
              <span className="w-9 text-right text-subtle">
                {((item.value / 1248) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
