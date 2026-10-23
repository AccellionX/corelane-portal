"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTour } from "@/components/tour/tour-context";
import { Button } from "@/components/ui/button";
import { TOUR_STEPS } from "@/lib/tour";
import { cn } from "@/lib/utils";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TourOverlay() {
  const pathname = usePathname();
  const { tourActive, step, stepIndex, nextStep, prevStep, skipTour } = useTour();
  const [rect, setRect] = useState<Rect | null>(null);
  const [vw, setVw] = useState(1024);
  const [vh, setVh] = useState(768);

  useEffect(() => {
    const sync = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    if (!tourActive || !step) {
      setRect(null);
      return;
    }

    let cancelled = false;
    let tries = 0;

    const measure = () => {
      if (cancelled) return;
      const el = document.querySelector(step.target) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        const r = el.getBoundingClientRect();
        setRect({
          top: r.top,
          left: r.left,
          width: Math.max(r.width, 40),
          height: Math.max(r.height, 32),
        });
        return;
      }
      tries += 1;
      if (tries < 24) {
        window.setTimeout(measure, 120);
      } else {
        setRect({
          top: Math.min(vh * 0.22, 160),
          left: Math.max(16, vw / 2 - 160),
          width: Math.min(320, vw - 32),
          height: 48,
        });
      }
    };

    const t = window.setTimeout(measure, 320);
    const onScroll = () => measure();
    window.addEventListener("scroll", onScroll, true);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [tourActive, step, pathname, stepIndex, vw, vh]);

  if (!tourActive || !step) return null;

  const pad = 8;
  const tooltipWidth = Math.min(360, vw - 32);
  const spot = rect ?? {
    top: 120,
    left: 24,
    width: 200,
    height: 40,
  };

  let tipTop = spot.top + spot.height + pad + 12;
  const tipLeft = Math.min(Math.max(16, spot.left), vw - tooltipWidth - 16);
  if (tipTop + 220 > vh) {
    tipTop = Math.max(16, spot.top - 220);
  }

  return (
    <div className="fixed inset-0 z-[110]">
      <div
        className="absolute inset-0 bg-zinc-950/40"
        onClick={skipTour}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute rounded-xl ring-2 ring-indigo-400 transition-all duration-300"
        style={{
          top: spot.top - pad,
          left: spot.left - pad,
          width: spot.width + pad * 2,
          height: spot.height + pad * 2,
          boxShadow: "0 0 0 9999px rgba(9, 9, 11, 0.55)",
        }}
      />

      <div
        className={cn(
          "absolute rounded-2xl border border-border/70 bg-background p-4 shadow-[var(--shadow-soft)] transition-all duration-300"
        )}
        style={{ top: tipTop, left: tipLeft, width: tooltipWidth }}
        role="dialog"
        aria-live="polite"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
          Step {stepIndex + 1} of {TOUR_STEPS.length}
        </p>
        <h3 className="mt-1 text-base font-semibold tracking-tight">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <Button variant="ghost" size="sm" className="rounded-xl" onClick={skipTour}>
            Skip tour
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={stepIndex === 0}
              onClick={prevStep}
            >
              Back
            </Button>
            <Button
              size="sm"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500"
              onClick={nextStep}
            >
              {stepIndex === TOUR_STEPS.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
