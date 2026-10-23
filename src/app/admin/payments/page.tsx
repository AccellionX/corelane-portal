"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { canRefundPayments } from "@/lib/access";
import { useCorelaneStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import type { Transaction, TransactionStatus } from "@/lib/types";

export default function AdminPaymentsPage() {
  const loading = useSimulatedLoading();
  const demoRole = useCorelaneStore((s) => s.role);
  const canRefund = canRefundPayments(demoRole);
  const transactions = useCorelaneStore((s) => s.transactions);
  const users = useCorelaneStore((s) => s.users);
  const refundTransaction = useCorelaneStore((s) => s.refundTransaction);
  const [status, setStatus] = useState<"all" | TransactionStatus>("all");
  const [refundTarget, setRefundTarget] = useState<Transaction | null>(null);

  const userMap = useMemo(
    () => Object.fromEntries(users.map((u) => [u.id, u])),
    [users]
  );

  const list = useMemo(
    () =>
      status === "all"
        ? transactions
        : transactions.filter((t) => t.status === status),
    [transactions, status]
  );

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
        title="Payments"
        description={
          canRefund
            ? "Filter transactions and refund paid charges with confirmation."
            : "View transactions only - refunds require Admin. Restricted - ask an Admin for access."
        }
        actions={
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as typeof status)}
          >
            <SelectTrigger className="w-[160px] rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {list.length === 0 ? (
        <EmptyState title="No transactions" description="Try another status filter." />
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                    <TableCell>{userMap[txn.userId]?.name ?? txn.userId}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {txn.description}
                    </TableCell>
                    <TableCell>{formatCurrency(txn.amount)}</TableCell>
                    <TableCell>
                      <StatusBadge value={txn.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(txn.date)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        data-tour="refund-btn"
                        disabled={!canRefund || txn.status !== "paid"}
                        title={
                          !canRefund
                            ? "Restricted - ask an Admin for access."
                            : undefined
                        }
                        onClick={() => {
                          if (!canRefund) {
                            toast.error("Restricted - ask an Admin for access.");
                            return;
                          }
                          setRefundTarget(txn);
                        }}
                      >
                        Refund
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={!!refundTarget}
        onOpenChange={(v) => !v && setRefundTarget(null)}
        title="Refund payment?"
        description={
          refundTarget
            ? `Refund ${formatCurrency(refundTarget.amount)} for ${refundTarget.id}. Status becomes refunded and linked invoices may void.`
            : ""
        }
        confirmLabel="Refund"
        destructive
        onConfirm={() => {
          if (!refundTarget) return;
          refundTransaction(refundTarget.id);
          toast.success(`Refunded ${refundTarget.id}`);
        }}
      />
    </div>
  );
}
