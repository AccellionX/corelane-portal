"use client";

import { Bell } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { selectCurrentUser, useCorelaneStore } from "@/lib/store";
import { formatRelative } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const loading = useSimulatedLoading();
  const user = useCorelaneStore(selectCurrentUser);
  const notifications = useCorelaneStore((s) => s.notifications);
  const markNotificationRead = useCorelaneStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useCorelaneStore((s) => s.markAllNotificationsRead);

  const list = notifications.filter((n) => n.userId === user.id);
  const unread = list.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={`${unread} unread · marking read updates the header bell`}
        actions={
          unread > 0 ? (
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => markAllNotificationsRead(user.id)}
            >
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {list.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="You're all caught up"
          description="Product, billing, and security alerts will land here."
        />
      ) : (
        <Card>
          <CardContent className="divide-y divide-border/60 p-0">
            {list.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  if (!n.read) markNotificationRead(n.id);
                }}
                className={cn(
                  "flex w-full gap-3 px-5 py-4 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-900/40",
                  !n.read && "bg-indigo-50/40 dark:bg-indigo-950/20"
                )}
              >
                <span
                  className={cn(
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                    n.read ? "bg-zinc-300" : "bg-indigo-600"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                    {n.type} · {formatRelative(n.createdAt)}
                  </p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
