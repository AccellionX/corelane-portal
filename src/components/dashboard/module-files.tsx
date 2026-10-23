"use client";

import { useCallback, useMemo, useState } from "react";
import { FileIcon, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { selectCurrentUser, useCorelaneStore } from "@/lib/store";
import { formatDate, formatRelative } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { cn } from "@/lib/utils";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function ModuleFiles({ title = "Files" }: { title?: string }) {
  const loading = useSimulatedLoading();
  const user = useCorelaneStore(selectCurrentUser);
  const files = useCorelaneStore((s) => s.files);
  const addFile = useCorelaneStore((s) => s.addFile);
  const removeFile = useCorelaneStore((s) => s.removeFile);
  const [dragging, setDragging] = useState(false);

  const mine = useMemo(
    () => files.filter((f) => f.userId === user.id),
    [files, user.id]
  );
  const list = mine.length ? mine : files;

  const ingest = useCallback(
    (fileList: FileList | null) => {
      if (!fileList?.length) return;
      Array.from(fileList).forEach((file) => {
        addFile({
          userId: user.id,
          name: file.name,
          size: file.size,
          mimeType: file.type || "application/octet-stream",
        });
      });
      toast.success(
        fileList.length === 1 ? "File uploaded" : `${fileList.length} files uploaded`
      );
    },
    [addFile, user.id]
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={title}
        description="Drag files into the dropzone or browse from your device."
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          ingest(e.dataTransfer.files);
        }}
        className={cn(
          "mb-6 flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center transition",
          dragging
            ? "border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/30"
            : "border-border/80 bg-background/60"
        )}
      >
        <Upload className="mb-3 h-8 w-8 text-indigo-600" />
        <p className="font-medium">Drop files to upload</p>
        <p className="mt-1 text-sm text-muted-foreground">
          PDF, images, CSV, and zip - mock storage only
        </p>
        <label className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-accent hover:text-accent-foreground">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              ingest(e.target.files);
              e.target.value = "";
            }}
          />
          Browse files
        </label>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Library is empty"
          description="Upload your first file to populate the grid."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((file) => (
            <Card key={file.id}>
              <CardContent className="flex gap-3 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50">
                  <FileIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(file.size)} · {formatRelative(file.uploadedAt)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {formatDate(file.uploadedAt)}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="shrink-0 rounded-xl text-muted-foreground hover:text-rose-600"
                  onClick={() => {
                    removeFile(file.id);
                    toast.message("File removed");
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
