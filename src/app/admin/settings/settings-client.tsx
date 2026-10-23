"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCorelaneStore } from "@/lib/store";
import { MODULE_META } from "@/lib/module-meta";
import { formatDateTime } from "@/lib/format";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import type { CoreModule, DemoEnvironment } from "@/lib/types";
import { cn } from "@/lib/utils";

const STACK = [
  "Next.js",
  "Node API",
  "PostgreSQL",
  "Payload CMS",
  "Stripe",
  "Auth.js",
];

const MODULES: CoreModule[] = ["bookings", "orders", "subscriptions", "uploads"];

export function AdminSettingsClient() {
  const loading = useSimulatedLoading();
  const searchParams = useSearchParams();
  const settings = useCorelaneStore((s) => s.adminSettings);
  const coreModule = useCorelaneStore((s) => s.coreModule);
  const environment = useCorelaneStore((s) => s.environment);
  const updateAdminSettings = useCorelaneStore((s) => s.updateAdminSettings);
  const setCoreModule = useCorelaneStore((s) => s.setCoreModule);
  const setEnvironment = useCorelaneStore((s) => s.setEnvironment);

  const tabParam = searchParams.get("tab");
  const initialTab =
    tabParam === "model" || tabParam === "system" || tabParam === "general"
      ? tabParam
      : "general";
  const [tab, setTab] = useState(initialTab);

  const [companyName, setCompanyName] = useState(settings.companyName);
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [timezone, setTimezone] = useState(settings.timezone);

  useEffect(() => {
    setCompanyName(settings.companyName);
    setSupportEmail(settings.supportEmail);
    setTimezone(settings.timezone);
  }, [settings]);

  useEffect(() => {
    if (tabParam === "model" || tabParam === "system" || tabParam === "general") {
      setTab(tabParam);
    }
  }, [tabParam]);

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
        title="Settings"
        description="General org details, product model, and system metadata."
      />

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="rounded-xl">
          <TabsTrigger value="general" className="rounded-lg">
            General
          </TabsTrigger>
          <TabsTrigger value="model" className="rounded-lg">
            Core business model
          </TabsTrigger>
          <TabsTrigger value="system" className="rounded-lg">
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>Workspace identity used across admin copy.</CardDescription>
            </CardHeader>
            <CardContent className="grid max-w-xl gap-4">
              <div className="space-y-2">
                <Label htmlFor="co">Company name</Label>
                <Input
                  id="co"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="em">Support email</Label>
                <Input
                  id="em"
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tz">Timezone</Label>
                <Input
                  id="tz"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <Button
                className="w-fit rounded-xl bg-indigo-600 hover:bg-indigo-500"
                onClick={() => {
                  updateAdminSettings({
                    companyName: companyName.trim(),
                    supportEmail: supportEmail.trim(),
                    timezone: timezone.trim(),
                  });
                  toast.success("General settings saved");
                }}
              >
                Save changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="model">
          <Card data-tour="core-model">
            <CardHeader>
              <CardTitle>Core business model</CardTitle>
              <CardDescription>
                Your platform adapts to whatever your core product turns out to be.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {MODULES.map((mod) => {
                  const meta = MODULE_META[mod];
                  const active = coreModule === mod;
                  return (
                    <button
                      key={mod}
                      type="button"
                      onClick={() => {
                        setCoreModule(mod);
                        toast.success(`Dashboard module → ${meta.label}`);
                      }}
                      className={cn(
                        "rounded-xl border p-4 text-left transition",
                        active
                          ? "border-indigo-600 ring-2 ring-indigo-600/20"
                          : "border-border/70 hover:border-border"
                      )}
                    >
                      <p className="font-semibold">{meta.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {meta.description}
                      </p>
                      <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                        {mod}
                      </p>
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Changing this updates the user dashboard sidebar and overview live. Current:{" "}
                <span className="font-medium text-foreground">
                  {MODULE_META[coreModule].label}
                </span>
                .
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Stack</CardTitle>
                <CardDescription>Reference architecture for this demo.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {STACK.map((item) => (
                    <li
                      key={item}
                      className="rounded-xl border border-border/60 px-3 py-2 text-sm font-medium"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deployment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Repository
                  </p>
                  <p className="mt-1 font-medium">
                    Repository: {settings.githubRepo}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Documentation
                  </p>
                  <a
                    href={settings.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline"
                  >
                    Open docs
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Last deploy
                  </p>
                  <p className="mt-1 font-medium">
                    {formatDateTime(settings.lastDeployAt)}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                    Environment
                  </p>
                  <div className="inline-flex rounded-xl border border-border/80 p-1">
                    {(["staging", "production"] as DemoEnvironment[]).map((env) => (
                      <button
                        key={env}
                        type="button"
                        onClick={() => {
                          setEnvironment(env);
                          toast.message(`Environment → ${env}`);
                        }}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition",
                          environment === env
                            ? env === "production"
                              ? "bg-emerald-600 text-white"
                              : "bg-amber-500 text-white"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Badge in the admin header reflects this value.
                  </p>
                </div>
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/app">Open user dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
