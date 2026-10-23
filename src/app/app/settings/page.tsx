"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { selectCurrentUser, useCorelaneStore } from "@/lib/store";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";

export default function SettingsPage() {
  const loading = useSimulatedLoading();
  const user = useCorelaneStore(selectCurrentUser);
  const prefs = useCorelaneStore((s) => s.notificationPrefs);
  const updateProfile = useCorelaneStore((s) => s.updateProfile);
  const updateNotificationPrefs = useCorelaneStore((s) => s.updateNotificationPrefs);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [company, setCompany] = useState(user.company);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setCompany(user.company);
  }, [user.name, user.email, user.company]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Profile, password, and notification preferences."
      />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Updates write to the shared demo store.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} className="rounded-xl" />
          </div>
          <div className="sm:col-span-2">
            <Button
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500"
              onClick={() => {
                if (name.trim().length < 2 || !email.includes("@")) {
                  toast.error("Check name and email");
                  return;
                }
                updateProfile(user.id, { name: name.trim(), email: email.trim(), company: company.trim() });
                toast.success("Profile saved");
              }}
            >
              Save profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Mock change - nothing is sent to a server.</CardDescription>
        </CardHeader>
        <CardContent className="grid max-w-md gap-4">
          <div className="space-y-2">
            <Label htmlFor="pw">New password</Label>
            <Input
              id="pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pw2">Confirm password</Label>
            <Input
              id="pw2"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <Button
            variant="outline"
            className="w-fit rounded-xl"
            onClick={() => {
              if (password.length < 8) {
                toast.error("Use at least 8 characters");
                return;
              }
              if (password !== confirm) {
                toast.error("Passwords do not match");
                return;
              }
              setPassword("");
              setConfirm("");
              toast.success("Password updated (mock)");
            }}
          >
            Update password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification preferences</CardTitle>
          <CardDescription>Control which alert types reach this seat.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(
            [
              ["product", "Product updates"],
              ["billing", "Billing & invoices"],
              ["security", "Security alerts"],
              ["support", "Support replies"],
              ["digest", "Weekly digest email"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <Label htmlFor={`pref-${key}`} className="font-normal">
                {label}
              </Label>
              <Switch
                id={`pref-${key}`}
                checked={prefs[key]}
                onCheckedChange={(checked) => {
                  updateNotificationPrefs({ [key]: checked });
                  toast.message(`${label} ${checked ? "on" : "off"}`);
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
