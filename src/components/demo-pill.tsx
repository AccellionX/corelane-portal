"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FlaskConical, RotateCcw, ChevronUp, Map } from "lucide-react";
import { toast } from "sonner";
import { useTour } from "@/components/tour/tour-context";
import { useCorelaneStore } from "@/lib/store";
import { defaultAdminHref } from "@/lib/access";
import type { CoreModule, DemoRole, DemoView } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const VIEWS: { id: DemoView; label: string; href: string }[] = [
  { id: "public", label: "Public Site", href: "/" },
  { id: "app", label: "User Dashboard", href: "/app" },
  { id: "admin", label: "Admin Panel", href: "/admin" },
];

const PRODUCT_MODULES: { id: CoreModule; label: string }[] = [
  { id: "bookings", label: "Bookings" },
  { id: "orders", label: "Orders" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "uploads", label: "Files" },
];

const ROLES: DemoRole[] = ["Admin", "Manager", "Support"];

function viewFromPath(pathname: string): DemoView {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/app")) return "app";
  return "public";
}

export function DemoPill() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const hydrated = useCorelaneStore((s) => s.hydrated);
  const demoView = useCorelaneStore((s) => s.demoView);
  const coreModule = useCorelaneStore((s) => s.coreModule);
  const role = useCorelaneStore((s) => s.role);
  const environment = useCorelaneStore((s) => s.environment);
  const setDemoView = useCorelaneStore((s) => s.setDemoView);
  const setCoreModule = useCorelaneStore((s) => s.setCoreModule);
  const setRole = useCorelaneStore((s) => s.setRole);
  const setEnvironment = useCorelaneStore((s) => s.setEnvironment);
  const resetDemo = useCorelaneStore((s) => s.resetDemo);
  const { restartTour } = useTour();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!hydrated) return;
    const fromPath = viewFromPath(pathname);
    if (fromPath !== demoView) setDemoView(fromPath);
  }, [pathname, hydrated, demoView, setDemoView]);

  if (!mounted) return null;

  const switchView = (view: DemoView) => {
    setDemoView(view);
    if (view === "admin") {
      router.push(defaultAdminHref(role));
      return;
    }
    router.push(VIEWS.find((v) => v.id === view)?.href ?? "/");
  };

  const handleReset = () => {
    try {
      resetDemo();
      toast.success("Demo reset", {
        description: "Seed data restored across public, app, and admin.",
      });
    } catch {
      toast.error("Could not reset demo");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {open && (
        <div className="w-[min(100vw-2rem,20rem)] overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/95 p-3 shadow-[var(--shadow-soft)] backdrop-blur-xl dark:border-zinc-700/80 dark:bg-zinc-950/95">
          <div className="mb-3 flex items-center justify-between px-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Demo controls
            </p>
            <button
              type="button"
              onClick={() =>
                setEnvironment(environment === "production" ? "staging" : "production")
              }
              className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-600 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              {environment}
            </button>
          </div>

          <p className="mb-1.5 px-1 text-[11px] font-medium text-zinc-500">View</p>
          <div className="mb-3 grid gap-1">
            {VIEWS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => switchView(m.id)}
                className={cn(
                  "rounded-xl px-3 py-2 text-left text-sm transition",
                  demoView === m.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>

          <p className="mb-1.5 px-1 text-[11px] font-medium text-zinc-500">
            Product module
          </p>
          <div className="mb-3 grid grid-cols-2 gap-1">
            {PRODUCT_MODULES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setCoreModule(m.id);
                  toast.message(`Core module → ${m.label}`);
                  if (pathname.startsWith("/app")) {
                    router.push(m.id === "uploads" ? "/app/uploads" : "/app/module");
                  }
                }}
                className={cn(
                  "rounded-xl px-2 py-1.5 text-xs font-medium transition",
                  coreModule === m.id
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>

          <p className="mb-1.5 px-1 text-[11px] font-medium text-zinc-500">Role</p>
          <div className="mb-3 flex gap-1">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  toast.message(`Acting as ${r}`);
                  if (pathname.startsWith("/admin")) {
                    router.push(defaultAdminHref(r));
                  }
                }}
                className={cn(
                  "flex-1 rounded-xl px-2 py-1.5 text-xs font-medium transition",
                  role === r
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                )}
              >
                {r}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="mb-2 w-full rounded-xl"
            onClick={() => {
              setOpen(false);
              restartTour();
            }}
          >
            <Map className="mr-2 h-3.5 w-3.5" />
            Restart tour
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-xl border-dashed"
            onClick={handleReset}
          >
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Reset demo
          </Button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_28px_rgba(79,70,229,0.45)] transition hover:bg-indigo-500"
        aria-expanded={open}
        aria-label="Demo controls"
      >
        <FlaskConical className="h-4 w-4" />
        <span>Demo</span>
        <ChevronUp
          className={cn(
            "h-3.5 w-3.5 opacity-80 transition",
            open ? "rotate-0" : "rotate-180"
          )}
        />
      </button>
    </div>
  );
}
