"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { canMutateUsers } from "@/lib/access";
import { useCorelaneStore } from "@/lib/store";
import { formatDate, formatRelative } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import type { User, UserRole, UserStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey = "name" | "plan" | "status" | "role" | "signupDate";
const PAGE_SIZE = 8;

export default function AdminUsersPage() {
  const loading = useSimulatedLoading();
  const users = useCorelaneStore((s) => s.users);
  const plans = useCorelaneStore((s) => s.plans);
  const demoRole = useCorelaneStore((s) => s.role);
  const canEdit = canMutateUsers(demoRole);
  const suspendUser = useCorelaneStore((s) => s.suspendUser);
  const reactivateUser = useCorelaneStore((s) => s.reactivateUser);
  const changeRole = useCorelaneStore((s) => s.changeRole);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [sortKey, setSortKey] = useState<SortKey>("signupDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<User | null>(null);
  const [confirm, setConfirm] = useState<{ user: User; action: "suspend" | "reactivate" } | null>(
    null
  );

  const filtered = useMemo(() => {
    let list = [...users];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.company.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") list = list.filter((u) => u.status === statusFilter);
    if (roleFilter !== "all") list = list.filter((u) => u.role === roleFilter);

    list.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [users, query, statusFilter, roleFilter, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="ml-1 inline h-3.5 w-3.5 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="ml-1 inline h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1 inline h-3.5 w-3.5" />
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description={
          canEdit
            ? "Search, filter, and manage seats. Status badges update live."
            : "Read-only for Support — actions are disabled. Ask an Admin to make changes."
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search name, email, company…"
            className="rounded-xl pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as typeof statusFilter);
            setPage(0);
          }}
        >
          <SelectTrigger className="w-full rounded-xl sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={roleFilter}
          onValueChange={(v) => {
            setRoleFilter(v as typeof roleFilter);
            setPage(0);
          }}
        >
          <SelectTrigger className="w-full rounded-xl sm:w-[140px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {(["Admin", "Manager", "Support", "User"] as UserRole[]).map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No users match" description="Try clearing filters or search." />
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {(
                    [
                      ["name", "Name"],
                      ["plan", "Plan"],
                      ["status", "Status"],
                      ["role", "Role"],
                      ["signupDate", "Joined"],
                    ] as [SortKey, string][]
                  ).map(([key, label]) => (
                    <TableHead key={key}>
                      <button
                        type="button"
                        className="inline-flex items-center font-medium"
                        onClick={() => toggleSort(key)}
                      >
                        {label}
                        <SortIcon col={key} />
                      </button>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(user)}
                  >
                    <TableCell>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </TableCell>
                    <TableCell className="capitalize">{user.plan}</TableCell>
                    <TableCell>
                      <StatusBadge value={user.status} />
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(user.signupDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {filtered.length} users · page {page + 1} of {pageCount}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            disabled={page >= pageCount - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>{selected.email}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Company</p>
                    <p className="font-medium">{selected.company}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Plan</p>
                    <p className="font-medium capitalize">
                      {plans.find((p) => p.id === selected.plan)?.name ?? selected.plan}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="font-medium">{formatDate(selected.signupDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last active</p>
                    <p className="font-medium">{formatRelative(selected.lastActive)}</p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Status
                  </p>
                  <StatusBadge value={selected.status} />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Role
                  </p>
                  <Select
                    value={selected.role}
                    disabled={!canEdit}
                    onValueChange={(value) => {
                      changeRole(selected.id, value as UserRole);
                      setSelected({ ...selected, role: value as UserRole });
                      toast.success(`Role → ${value}`);
                    }}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["Admin", "Manager", "Support", "User"] as UserRole[]).map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  disabled={!canEdit}
                  className={cn(
                    "w-full rounded-xl",
                    selected.status === "active"
                      ? "bg-rose-600 hover:bg-rose-500"
                      : "bg-indigo-600 hover:bg-indigo-500"
                  )}
                  onClick={() =>
                    setConfirm({
                      user: selected,
                      action: selected.status === "active" ? "suspend" : "reactivate",
                    })
                  }
                >
                  {selected.status === "active" ? "Suspend user" : "Reactivate user"}
                </Button>
                {!canEdit && (
                  <p className="text-center text-xs text-muted-foreground">
                    Restricted — ask an Admin for access.
                  </p>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(v) => !v && setConfirm(null)}
        title={confirm?.action === "suspend" ? "Suspend user?" : "Reactivate user?"}
        description={
          confirm
            ? confirm.action === "suspend"
              ? `${confirm.user.name} will lose access until reactivated.`
              : `${confirm.user.name} will regain access immediately.`
            : ""
        }
        confirmLabel={confirm?.action === "suspend" ? "Suspend" : "Reactivate"}
        destructive={confirm?.action === "suspend"}
        onConfirm={() => {
          if (!confirm) return;
          if (confirm.action === "suspend") {
            suspendUser(confirm.user.id);
            setSelected({ ...confirm.user, status: "suspended" });
            toast.message("User suspended");
          } else {
            reactivateUser(confirm.user.id);
            setSelected({ ...confirm.user, status: "active" });
            toast.success("User reactivated");
          }
        }}
      />
    </div>
  );
}
