"use client";

import { Sparkles } from "lucide-react";
import { useTour } from "@/components/tour/tour-context";
import { Button } from "@/components/ui/button";

export function WelcomeModal() {
  const { ready, showWelcome, startTour, skipWelcome } = useTour();

  if (!ready || !showWelcome) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-zinc-950/50 p-4 backdrop-blur-sm sm:items-center animate-in fade-in-0 duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border/70 bg-background shadow-[var(--shadow-soft)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 sm:slide-in-from-bottom-0"
      >
        <div className="gradient-mesh border-b border-border/60 px-6 py-8 sm:px-8">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-[0_8px_24px_rgba(79,70,229,0.35)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 id="welcome-title" className="text-2xl font-semibold tracking-tight">
            Welcome to Corelane
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Built for your PORTAL post. A working preview of your public site, user dashboard and
            admin panel.
          </p>
        </div>
        <div className="flex flex-col gap-2 p-4 sm:flex-row sm:justify-end sm:gap-3 sm:p-6">
          <Button
            variant="outline"
            className="rounded-xl order-2 sm:order-1"
            onClick={skipWelcome}
          >
            Explore freely
          </Button>
          <Button
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 order-1 sm:order-2"
            onClick={startTour}
          >
            Take the 60-second tour
          </Button>
        </div>
      </div>
    </div>
  );
}
