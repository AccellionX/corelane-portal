"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { selectCurrentUser, useCorelaneStore } from "@/lib/store";
import { MODULE_META } from "@/lib/module-meta";
import { formatCurrency, formatDate, formatRelative } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";

export default function AppOverviewPage() {
  const loading = useSimulatedLoading();
  const coreModule = useCorelaneStore((s) => s.coreModule);
  const user = useCorelaneStore(selectCurrentUser);
  const bookings = useCorelaneStore((s) => s.bookings);
  const orders = useCorelaneStore((s) => s.orders);
  const invoices = useCorelaneStore((s) => s.invoices);
  const notifications = useCorelaneStore((s) => s.notifications);
  const files = useCorelaneStore((s) => s.files);
  const usageMeters = useCorelaneStore((s) => s.usageMeters);
  const plans = useCorelaneStore((s) => s.plans);
  const tickets = useCorelaneStore((s) => s.tickets);

  const plan = plans.find((p) => p.id === user.plan);
  const meta = MODULE_META[coreModule];
  const unread = notifications.filter((n) => n.userId === user.id && !n.read).length;

  const myBookings = bookings.filter((b) => b.userId === user.id);
  const myOrders = orders.filter((o) => o.userId === user.id);
  const myInvoices = invoices.filter((i) => i.userId === user.id);
  const myFiles = files.filter((f) => f.userId === user.id);
  const myTickets = tickets.filter((t) => t.userId === user.id);

  const cards = (() => {
    switch (coreModule) {
      case "orders":
        return [
          {
            label: "Open orders",
            value: String(
              (myOrders.length ? myOrders : orders).filter(
                (o) => o.status === "processing" || o.status === "shipped"
              ).length
            ),
          },
          {
            label: "Delivered",
            value: String(
              (myOrders.length ? myOrders : orders).filter((o) => o.status === "delivered")
                .length
            ),
          },
          {
            label: "Unread alerts",
            value: String(unread),
          },
          {
            label: "Open invoices",
            value: String(
              myInvoices.filter((i) => i.status === "open" || i.status === "overdue").length
            ),
          },
        ];
      case "subscriptions":
        return [
          { label: "Plan", value: plan?.name ?? "-" },
          {
            label: "Seat usage",
            value: `${usageMeters[0]?.used ?? 0}/${usageMeters[0]?.limit ?? 0}`,
          },
          {
            label: "API usage",
            value: `${Math.round(((usageMeters[3]?.used ?? 0) / (usageMeters[3]?.limit ?? 1)) * 100)}%`,
          },
          { label: "MRR", value: formatCurrency(plan?.price ?? 0) },
        ];
      case "uploads":
        return [
          { label: "Files in library", value: String(myFiles.length || files.length) },
          {
            label: "Storage used",
            value: `${usageMeters.find((m) => m.id === "usage_storage")?.used ?? 0} GB`,
          },
          { label: "Unread alerts", value: String(unread) },
          {
            label: "Open tickets",
            value: String(myTickets.filter((t) => t.status !== "resolved").length),
          },
        ];
      case "bookings":
      default:
        return [
          {
            label: "Upcoming bookings",
            value: String(
              (myBookings.length ? myBookings : bookings).filter(
                (b) => b.status === "confirmed" || b.status === "pending"
              ).length
            ),
          },
          {
            label: "Open invoices",
            value: String(
              myInvoices.filter((i) => i.status === "open" || i.status === "overdue").length
            ),
          },
          { label: "Unread alerts", value: String(unread) },
          {
            label: "Open tickets",
            value: String(myTickets.filter((t) => t.status !== "resolved").length),
          },
        ];
    }
  })();

  const chartData = [
    { month: "May", value: 42 },
    { month: "Jun", value: 51 },
    { month: "Jul", value: 48 },
    { month: "Aug", value: 62 },
    { month: "Sep", value: 58 },
    { month: "Oct", value: 71 },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8" data-tour="app-overview">
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description={`${user.company} · ${plan?.name} plan · joined ${formatDate(user.signupDate)}`}
        actions={
          <Button asChild className="rounded-xl bg-indigo-600 hover:bg-indigo-500">
            <Link href={meta.href}>
              Open {meta.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl tracking-tight">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              {coreModule === "orders"
                ? "Fulfillment volume"
                : coreModule === "uploads"
                  ? "Upload activity"
                  : coreModule === "subscriptions"
                    ? "Seat utilization"
                    : "Booking activity"}
            </CardTitle>
            <CardDescription>Adapted to the {meta.label.toLowerCase()} module</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="mod" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4f46e5"
                  fill="url(#mod)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Latest for your seat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications
              .filter((n) => n.userId === user.id)
              .slice(0, 5)
              .map((n) => (
                <div key={n.id} className="flex gap-3">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-zinc-300" : "bg-indigo-600"}`}
                  />
                  <div>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{formatRelative(n.createdAt)}</p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {coreModule === "bookings" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Next bookings</CardTitle>
            <Button asChild variant="ghost" size="sm" className="rounded-xl">
              <Link href="/app/module">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-border/60">
            {(myBookings.length ? myBookings : bookings).slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{b.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(b.date)} · {b.location}
                  </p>
                </div>
                <StatusBadge value={b.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {coreModule === "orders" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent orders</CardTitle>
            <Button asChild variant="ghost" size="sm" className="rounded-xl">
              <Link href="/app/module">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-border/60">
            {(myOrders.length ? myOrders : orders).slice(0, 4).map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{o.id}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(o.total)}</p>
                </div>
                <StatusBadge value={o.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
