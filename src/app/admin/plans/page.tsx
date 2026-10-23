"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCorelaneStore } from "@/lib/store";
import { formatCurrency } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import type { Plan } from "@/lib/types";

const emptyPlan = (): Plan => ({
  id: `plan_${Date.now().toString(36)}`,
  name: "",
  price: 29,
  interval: "month",
  description: "",
  features: [""],
  highlighted: false,
});

export default function AdminPlansPage() {
  const loading = useSimulatedLoading();
  const plans = useCorelaneStore((s) => s.plans);
  const upsertPlan = useCorelaneStore((s) => s.upsertPlan);
  const deletePlan = useCorelaneStore((s) => s.deletePlan);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Plan>(emptyPlan());
  const [editing, setEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openCreate = () => {
    setDraft(emptyPlan());
    setEditing(false);
    setOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setDraft({ ...plan, features: [...plan.features] });
    setEditing(true);
    setOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services & Plans"
        description="CRUD for the subscription tiers powering pricing and billing."
        actions={
          <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-500" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add plan
          </Button>
        }
      />

      {plans.length === 0 ? (
        <EmptyState
          title="No plans"
          description="Create a plan to show on Pricing and Billing."
          actionLabel="Add plan"
          onAction={openCreate}
        />
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Highlighted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-xs text-muted-foreground">{plan.id}</p>
                    </TableCell>
                    <TableCell>{formatCurrency(plan.price)}/mo</TableCell>
                    <TableCell className="max-w-[240px] truncate text-muted-foreground">
                      {plan.features.length} items
                    </TableCell>
                    <TableCell>{plan.highlighted ? "Yes" : "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-xl"
                        onClick={() => openEdit(plan)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-xl text-rose-600"
                        onClick={() => setDeleteId(plan.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit plan" : "Add plan"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Price (USD / month)</Label>
              <Input
                type="number"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) || 0 })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Features (one per line)</Label>
              <Textarea
                value={draft.features.join("\n")}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    features: e.target.value.split("\n").filter((l) => l.trim().length > 0),
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="hl">Highlighted on pricing</Label>
              <Switch
                id="hl"
                checked={!!draft.highlighted}
                onCheckedChange={(v) => setDraft({ ...draft, highlighted: v })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500"
              onClick={() => {
                if (!draft.name.trim()) {
                  toast.error("Name is required");
                  return;
                }
                upsertPlan({
                  ...draft,
                  name: draft.name.trim(),
                  features: draft.features.length ? draft.features : ["Core access"],
                });
                toast.success(editing ? "Plan updated" : "Plan created");
                setOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete plan?"
        description="Customers on this plan keep their ID until reassigned. Pricing page updates immediately."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteId) {
            deletePlan(deleteId);
            toast.message("Plan deleted");
          }
        }}
      />
    </div>
  );
}
