"use client";

import { useMemo, useState } from "react";
import { format, parseISO, startOfWeek, addDays, isSameDay } from "date-fns";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { selectCurrentUser, useCorelaneStore } from "@/lib/store";
import { formatDateTime } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";

export function ModuleBookings() {
  const loading = useSimulatedLoading();
  const user = useCorelaneStore(selectCurrentUser);
  const bookings = useCorelaneStore((s) => s.bookings);
  const addBooking = useCorelaneStore((s) => s.addBooking);
  const cancelBooking = useCorelaneStore((s) => s.cancelBooking);
  const rescheduleBooking = useCorelaneStore((s) => s.rescheduleBooking);

  const mine = useMemo(
    () => bookings.filter((b) => b.userId === user.id),
    [bookings, user.id]
  );
  const list = mine.length ? mine : bookings.slice(0, 12);

  const [open, setOpen] = useState(false);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Zoom · Corelane");
  const [date, setDate] = useState("");
  const [attendees, setAttendees] = useState("4");

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const submitNew = () => {
    if (!title.trim() || !date) {
      toast.error("Add a title and start time");
      return;
    }
    const start = new Date(date);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    addBooking({
      userId: user.id,
      title: title.trim(),
      location,
      date: start.toISOString(),
      endDate: end.toISOString(),
      status: "confirmed",
      attendees: Number(attendees) || 1,
    });
    toast.success("Booking created");
    setOpen(false);
    setTitle("");
    setDate("");
  };

  const submitReschedule = () => {
    if (!rescheduleId || !date) return;
    const start = new Date(date);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    rescheduleBooking(rescheduleId, start.toISOString(), end.toISOString());
    toast.success("Booking rescheduled");
    setRescheduleId(null);
    setDate("");
  };

  return (
    <div>
      <PageHeader
        title="Bookings"
        description="List and calendar views for your workspace holds."
        actions={
          <Button
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500"
            onClick={() => setOpen(true)}
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            New booking
          </Button>
        }
      />

      <Tabs defaultValue="list">
        <TabsList className="mb-4 rounded-xl">
          <TabsTrigger value="list" className="rounded-lg">
            List
          </TabsTrigger>
          <TabsTrigger value="calendar" className="rounded-lg">
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-3">
          {list.length === 0 ? (
            <EmptyState
              title="No bookings yet"
              description="Create your first hold to see it here and on the calendar."
              actionLabel="New booking"
              onAction={() => setOpen(true)}
            />
          ) : (
            list.map((b) => (
              <Card key={b.id}>
                <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{b.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(b.date)} · {b.location}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge value={b.status} />
                    {b.status !== "cancelled" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => {
                            setRescheduleId(b.id);
                            setDate(b.date.slice(0, 16));
                          }}
                        >
                          Reschedule
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-xl text-rose-600"
                          onClick={() => {
                            cancelBooking(b.id);
                            toast.message("Booking cancelled");
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Week of {format(weekStart, "MMM d")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-7">
                {weekDays.map((day) => {
                  const dayBookings = list.filter((b) =>
                    isSameDay(parseISO(b.date), day)
                  );
                  return (
                    <div
                      key={day.toISOString()}
                      className="min-h-[120px] rounded-xl border border-border/60 p-2"
                    >
                      <p className="text-[11px] font-medium text-muted-foreground">
                        {format(day, "EEE d")}
                      </p>
                      <div className="mt-2 space-y-1">
                        {dayBookings.map((b) => (
                          <div
                            key={b.id}
                            className="rounded-lg bg-indigo-50 px-1.5 py-1 text-[10px] font-medium text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                          >
                            {b.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="bk-title">Title</Label>
              <Input id="bk-title" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bk-date">Start</Label>
              <Input
                id="bk-date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bk-loc">Location</Label>
              <Input id="bk-loc" value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bk-att">Attendees</Label>
              <Input id="bk-att" value={attendees} onChange={(e) => setAttendees(e.target.value)} className="rounded-xl" />
            </div>
          </div>
          <DialogFooter>
            <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-500" onClick={submitNew}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!rescheduleId} onOpenChange={(v) => !v && setRescheduleId(null)}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rs-date">New start</Label>
            <Input
              id="rs-date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <DialogFooter>
            <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-500" onClick={submitReschedule}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
