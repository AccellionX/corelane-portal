"use client";

import { toast } from "sonner";
import { Download, FileText } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { selectCurrentUser, useCorelaneStore } from "@/lib/store";
import { downloadInvoicePdf } from "@/lib/invoice-pdf";
import { formatCurrency, formatDate } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";

export default function InvoicesPage() {
  const loading = useSimulatedLoading();
  const user = useCorelaneStore(selectCurrentUser);
  const invoices = useCorelaneStore((s) => s.invoices);

  const mine = invoices.filter((i) => i.userId === user.id);
  const list = mine.length ? mine : invoices.slice(0, 12);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Download PDF copies generated with jsPDF."
      />

      {list.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices"
          description="Invoices appear after subscription charges clear."
        />
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">PDF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.number}</TableCell>
                    <TableCell>{formatDate(inv.issuedDate)}</TableCell>
                    <TableCell>{formatDate(inv.dueDate)}</TableCell>
                    <TableCell>{formatCurrency(inv.amount)}</TableCell>
                    <TableCell>
                      <StatusBadge value={inv.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => {
                          try {
                            downloadInvoicePdf(inv, user);
                            toast.success("Invoice downloaded");
                          } catch {
                            toast.error("PDF export failed");
                          }
                        }}
                      >
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        Download PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
