"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCorelaneStore } from "@/lib/store";
import { formatCurrency, formatRelative } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";

type RangeKey = "30d" | "90d" | "12m" | "all";

export default function AdminAnalyticsPage() {
  const loading = useSimulatedLoading(400);
  const [range, setRange] = useState<RangeKey>("12m");
  const transactions = useCorelaneStore((s) => s.transactions);
  const users = useCorelaneStore((s) => s.users);
  const logs = useCorelaneStore((s) => s.logs);

  const now = useMemo(() => new Date(), []);

  const rangeInterval = useMemo(() => {
    if (range === "all") return null;
    const months = range === "30d" ? 1 : range === "90d" ? 3 : 12;
    return {
      start: startOfMonth(subMonths(now, months - 1)),
      end: endOfMonth(now),
    };
  }, [range, now]);

  const filteredTx = useMemo(() => {
    if (!rangeInterval) return transactions;
    return transactions.filter((t) =>
      isWithinInterval(parseISO(t.date), rangeInterval)
    );
  }, [transactions, rangeInterval]);

  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const revenueThisMonth = transactions
    .filter(
      (t) =>
        t.status === "paid" &&
        isWithinInterval(parseISO(t.date), { start: thisMonthStart, end: now })
    )
    .reduce((s, t) => s + t.amount, 0);

  const revenueLastMonth = transactions
    .filter(
      (t) =>
        t.status === "paid" &&
        isWithinInterval(parseISO(t.date), { start: lastMonthStart, end: lastMonthEnd })
    )
    .reduce((s, t) => s + t.amount, 0);

  const revenueChange =
    revenueLastMonth === 0
      ? 100
      : Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100);

  const newSignups = users.filter((u) =>
    rangeInterval
      ? isWithinInterval(parseISO(u.signupDate), rangeInterval)
      : true
  ).length;

  const activeUsers = users.filter((u) => u.status === "active").length;
  const refunds = filteredTx.filter((t) => t.status === "refunded").length;

  const revenueSeries = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = subMonths(now, 11 - i);
      const start = startOfMonth(month);
      const end = endOfMonth(month);
      const value = transactions
        .filter(
          (t) =>
            t.status === "paid" &&
            isWithinInterval(parseISO(t.date), { start, end })
        )
        .reduce((s, t) => s + t.amount, 0);
      return { month: format(month, "MMM"), value };
    });
  }, [transactions, now]);

  const signupSeries = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = subMonths(now, 11 - i);
      const start = startOfMonth(month);
      const end = endOfMonth(month);
      const value = users.filter((u) =>
        isWithinInterval(parseISO(u.signupDate), { start, end })
      ).length;
      return { month: format(month, "MMM"), value };
    });
  }, [users, now]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        description="Revenue, growth, and recent admin activity."
        actions={
          <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
            <SelectTrigger className="w-[160px] rounded-xl">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenue this month</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(revenueThisMonth)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={
                revenueChange >= 0 ? "text-sm text-emerald-600" : "text-sm text-rose-600"
              }
            >
              {revenueChange >= 0 ? "+" : ""}
              {revenueChange}% vs last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>New signups</CardDescription>
            <CardTitle className="text-3xl">{newSignups}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">In selected range</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active users</CardDescription>
            <CardTitle className="text-3xl">{activeUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Of {users.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Refunds</CardDescription>
            <CardTitle className="text-3xl">{refunds}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">In selected range</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Revenue · 12 months</CardTitle>
              <CardDescription>Paid transactions only</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueSeries}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    formatter={(v) => [formatCurrency(Number(v)), "Revenue"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="url(#rev)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Signups · 12 months</CardTitle>
            </CardHeader>
            <CardContent className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={signupSeries}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                  <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>From the shared audit log</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {logs.slice(0, 10).map((log) => (
              <div key={log.id}>
                <p className="text-sm">
                  <span className="font-medium">{log.actor}</span>{" "}
                  <span className="text-muted-foreground">{log.action}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {log.target} · {formatRelative(log.timestamp)}
                </p>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
