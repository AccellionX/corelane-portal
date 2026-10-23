"use client";

import { toast } from "sonner";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
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
import { useCorelaneStore } from "@/lib/store";
import { downloadActivityLogsCsv } from "@/lib/export-csv";
import { formatDateTime } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";

export default function AdminLogsPage() {
  const loading = useSimulatedLoading();
  const logs = useCorelaneStore((s) => s.logs);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Logs"
        description="Every admin mutation in this demo session."
        actions={
          <Button
            variant="outline"
            className="rounded-xl"
            data-tour="export-csv"
            disabled={logs.length === 0}
            onClick={() => {
              try {
                downloadActivityLogsCsv(logs);
                toast.success("CSV downloaded");
              } catch {
                toast.error("Export failed");
              }
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      {logs.length === 0 ? (
        <EmptyState
          title="No activity yet"
          description="Suspend a user, refund a payment, or publish content to populate the log."
        />
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDateTime(log.timestamp)}
                    </TableCell>
                    <TableCell className="font-medium">{log.actor}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell className="font-mono text-xs">{log.target}</TableCell>
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
