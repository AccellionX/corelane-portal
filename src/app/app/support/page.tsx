"use client";

import { useMemo, useState } from "react";
import { LifeBuoy } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { selectCurrentUser, useCorelaneStore } from "@/lib/store";
import { formatDateTime, formatRelative } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import type { TicketPriority } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function SupportPage() {
  const loading = useSimulatedLoading();
  const user = useCorelaneStore(selectCurrentUser);
  const tickets = useCorelaneStore((s) => s.tickets);
  const addTicket = useCorelaneStore((s) => s.addTicket);
  const replyToTicket = useCorelaneStore((s) => s.replyToTicket);

  const mine = useMemo(
    () => tickets.filter((t) => t.userId === user.id),
    [tickets, user.id]
  );
  const list = mine.length ? mine : tickets.slice(0, 8);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = list.find((t) => t.id === selectedId) ?? list[0] ?? null;

  const [newOpen, setNewOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Product");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Support"
        description="Threaded tickets shared with the admin queue."
        actions={
          <Button
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500"
            onClick={() => setNewOpen(true)}
          >
            New ticket
          </Button>
        }
      />

      {list.length === 0 ? (
        <EmptyState
          icon={LifeBuoy}
          title="No tickets yet"
          description="Open a ticket if something looks off in billing, bookings, or files."
          actionLabel="New ticket"
          onAction={() => setNewOpen(true)}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <Card className="h-fit overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-2">
              {list.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedId(t.id)}
                  className={cn(
                    "w-full rounded-xl px-3 py-2.5 text-left transition",
                    (selected?.id ?? list[0]?.id) === t.id
                      ? "bg-indigo-50 dark:bg-indigo-950/40"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  <p className="truncate text-sm font-medium">{t.subject}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {formatRelative(t.updatedAt)}
                  </p>
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
                    {selected.id} · {selected.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge value={selected.priority} />
                  <StatusBadge value={selected.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {selected.messages.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900/60"
                  >
                    <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-medium">
                        {m.authorName}{" "}
                        <span className="text-muted-foreground">· {m.authorRole}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatDateTime(m.createdAt)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{m.body}</p>
                  </div>
                ))}

                {selected.status !== "resolved" && (
                  <div className="space-y-2 border-t border-border/60 pt-4">
                    <Label htmlFor="reply">Reply</Label>
                    <Textarea
                      id="reply"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Add more context for the support team…"
                    />
                    <Button
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-500"
                      onClick={() => {
                        if (reply.trim().length < 2) {
                          toast.error("Write a short reply first");
                          return;
                        }
                        replyToTicket(selected.id, reply.trim(), user.name);
                        setReply("");
                        toast.success("Reply sent");
                      }}
                    >
                      Send reply
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="sub">Subject</Label>
              <Input
                id="sub"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Billing", "Product", "Accounts", "API"].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as TicketPriority)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["low", "medium", "high", "urgent"] as TicketPriority[]).map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="msg">Message</Label>
              <Textarea
                id="msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500"
              onClick={() => {
                if (subject.trim().length < 4 || message.trim().length < 10) {
                  toast.error("Add a clear subject and message");
                  return;
                }
                addTicket({
                  userId: user.id,
                  subject: subject.trim(),
                  category,
                  priority,
                  status: "open",
                  message: message.trim(),
                });
                toast.success("Ticket created");
                setNewOpen(false);
                setSubject("");
                setMessage("");
              }}
            >
              Submit ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
