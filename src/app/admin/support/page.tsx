"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCorelaneStore } from "@/lib/store";
import { formatRelative } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { cn } from "@/lib/utils";

export default function AdminSupportPage() {
  const loading = useSimulatedLoading();
  const tickets = useCorelaneStore((s) => s.tickets);
  const users = useCorelaneStore((s) => s.users);
  const resolveTicket = useCorelaneStore((s) => s.resolveTicket);
  const assignTicket = useCorelaneStore((s) => s.assignTicket);

  const agents = useMemo(
    () => users.filter((u) => u.role === "Admin" || u.role === "Manager" || u.role === "Support"),
    [users]
  );
  const userMap = useMemo(
    () => Object.fromEntries(users.map((u) => [u.id, u])),
    [users]
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = tickets.find((t) => t.id === selectedId) ?? tickets[0] ?? null;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support"
        description="Assign agents and resolve tickets across the workspace."
      />

      {tickets.length === 0 ? (
        <EmptyState title="No tickets" description="Customer tickets will appear here." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
          <Card className="h-fit">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">All tickets</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[70vh] space-y-1 overflow-y-auto p-2">
              {tickets.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedId(t.id)}
                  className={cn(
                    "w-full rounded-xl px-3 py-2.5 text-left transition",
                    selected?.id === t.id
                      ? "bg-indigo-50 dark:bg-indigo-950/40"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  <p className="truncate text-sm font-medium">{t.subject}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusBadge value={t.status} />
                    <span className="text-[11px] text-muted-foreground">
                      {formatRelative(t.updatedAt)}
                    </span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {selected && (
            <Card>
              <CardHeader className="flex flex-col gap-3 border-b border-border/60 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-lg">{selected.subject}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {selected.id} · {userMap[selected.userId]?.name} · {selected.category}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge value={selected.priority} />
                  <StatusBadge value={selected.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1 space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Assign to
                    </p>
                    <Select
                      value={selected.assignedTo ?? "unassigned"}
                      onValueChange={(v) => {
                        assignTicket(selected.id, v === "unassigned" ? undefined : v);
                        toast.message(
                          v === "unassigned"
                            ? "Unassigned"
                            : `Assigned to ${userMap[v]?.name ?? v}`
                        );
                      }}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {agents.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name} ({a.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selected.status !== "resolved" && (
                    <Button
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-500"
                      onClick={() => {
                        resolveTicket(selected.id);
                        toast.success("Ticket resolved");
                      }}
                    >
                      Resolve
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  {selected.messages.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-xl bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-900/50"
                    >
                      <span className="font-medium">{m.authorName}</span>
                      <span className="text-muted-foreground"> - {m.body}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
