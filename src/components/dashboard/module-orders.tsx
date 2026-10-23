"use client";

import { useMemo, useState } from "react";
import { Package } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { selectCurrentUser, useCorelaneStore } from "@/lib/store";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import type { Order } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ModuleOrders() {
  const loading = useSimulatedLoading();
  const user = useCorelaneStore(selectCurrentUser);
  const orders = useCorelaneStore((s) => s.orders);
  const [selected, setSelected] = useState<Order | null>(null);

  const mine = useMemo(
    () => orders.filter((o) => o.userId === user.id),
    [orders, user.id]
  );
  const list = mine.length ? mine : orders.slice(0, 12);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Track fulfillment from processing through delivery."
      />

      {list.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders"
          description="When you place hardware or kit orders, they appear here with live tracking."
        />
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((o) => (
                  <TableRow
                    key={o.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(o)}
                  >
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell>{formatDate(o.date)}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {o.items.map((i) => i.name).join(", ")}
                    </TableCell>
                    <TableCell>{formatCurrency(o.total)}</TableCell>
                    <TableCell>
                      <StatusBadge value={o.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.id}</SheetTitle>
                <SheetDescription>
                  {formatDate(selected.date)}
                  {selected.trackingNumber ? ` · ${selected.trackingNumber}` : ""}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Status
                  </p>
                  <div className="mt-2">
                    <StatusBadge value={selected.status} />
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Tracking timeline
                  </p>
                  <ol className="space-y-4 border-l border-border/80 pl-4">
                    {(selected.timeline ?? []).map((step, i) => (
                      <li key={i} className="relative">
                        <span
                          className={cn(
                            "absolute -left-[1.35rem] top-1 h-2.5 w-2.5 rounded-full",
                            step.done ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-600"
                          )}
                        />
                        <p
                          className={cn(
                            "text-sm font-medium",
                            !step.done && "text-muted-foreground"
                          )}
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(step.at)}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Line items
                  </p>
                  <ul className="space-y-2 text-sm">
                    {selected.items.map((item) => (
                      <li key={item.name} className="flex justify-between gap-2">
                        <span>
                          {item.quantity}× {item.name}
                        </span>
                        <span className="text-muted-foreground">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 flex justify-between border-t border-border/60 pt-3 font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(selected.total)}</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
