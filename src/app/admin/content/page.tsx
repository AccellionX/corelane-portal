"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  contentHasUnsavedChanges,
  useCorelaneStore,
} from "@/lib/store";
import { formatDateTime, formatRelative } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { cn } from "@/lib/utils";

export default function AdminContentPage() {
  const loading = useSimulatedLoading();
  const draft = useCorelaneStore((s) => s.contentDraft);
  const versions = useCorelaneStore((s) => s.contentVersions);
  const unsaved = useCorelaneStore(contentHasUnsavedChanges);
  const setContentDraft = useCorelaneStore((s) => s.setContentDraft);
  const publishContent = useCorelaneStore((s) => s.publishContent);
  const restoreContentVersion = useCorelaneStore((s) => s.restoreContentVersion);

  const statusLabel = useMemo(
    () => (unsaved ? "Unsaved changes" : "Published"),
    [unsaved]
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content"
        description="Edit the public homepage CMS. Publish pushes live instantly."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                unsaved
                  ? "bg-amber-50 text-amber-800 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200"
                  : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
              )}
            >
              {statusLabel}
            </span>
            <Button
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500"
              disabled={!unsaved}
              onClick={() => {
                publishContent();
                toast.success("Published - public site updated");
              }}
            >
              Publish
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Hero</CardTitle>
          <CardDescription>Appears on the marketing homepage after publish.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              data-tour="cms-headline"
              value={draft.heroHeadline}
              onChange={(e) =>
                setContentDraft({
                  ...draft,
                  heroHeadline: e.target.value,
                  published: false,
                  updatedAt: new Date().toISOString(),
                })
              }
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtext">Subtext</Label>
            <Textarea
              id="subtext"
              value={draft.heroSubtext}
              onChange={(e) =>
                setContentDraft({
                  ...draft,
                  heroSubtext: e.target.value,
                  published: false,
                  updatedAt: new Date().toISOString(),
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {draft.features.map((feature, idx) => (
            <div key={feature.id} className="grid gap-3 rounded-xl border border-border/60 p-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Title</Label>
                <Input
                  value={feature.title}
                  className="rounded-xl"
                  onChange={(e) => {
                    const features = draft.features.map((f, i) =>
                      i === idx ? { ...f, title: e.target.value } : f
                    );
                    setContentDraft({
                      ...draft,
                      features,
                      published: false,
                      updatedAt: new Date().toISOString(),
                    });
                  }}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={feature.description}
                  onChange={(e) => {
                    const features = draft.features.map((f, i) =>
                      i === idx ? { ...f, description: e.target.value } : f
                    );
                    setContentDraft({
                      ...draft,
                      features,
                      published: false,
                      updatedAt: new Date().toISOString(),
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FAQ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {draft.faq.map((item, idx) => (
            <div key={item.id} className="space-y-3 rounded-xl border border-border/60 p-4">
              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  value={item.question}
                  className="rounded-xl"
                  onChange={(e) => {
                    const faq = draft.faq.map((f, i) =>
                      i === idx ? { ...f, question: e.target.value } : f
                    );
                    setContentDraft({
                      ...draft,
                      faq,
                      published: false,
                      updatedAt: new Date().toISOString(),
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea
                  value={item.answer}
                  onChange={(e) => {
                    const faq = draft.faq.map((f, i) =>
                      i === idx ? { ...f, answer: e.target.value } : f
                    );
                    setContentDraft({
                      ...draft,
                      faq,
                      published: false,
                      updatedAt: new Date().toISOString(),
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Version history</CardTitle>
          <CardDescription>Last 5 published versions - restore loads into the draft.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border/60">
          {versions.length === 0 && (
            <p className="text-sm text-muted-foreground">No versions yet. Publish to create one.</p>
          )}
          {versions.slice(0, 5).map((ver) => (
            <div
              key={ver.id}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium line-clamp-1">
                  {ver.snapshot.heroHeadline}
                </p>
                <p className="text-xs text-muted-foreground">
                  {ver.actor} · {formatDateTime(ver.publishedAt)} ·{" "}
                  {formatRelative(ver.publishedAt)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => {
                  restoreContentVersion(ver.id);
                  toast.message("Version restored to draft - publish to go live");
                }}
              >
                Restore
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
