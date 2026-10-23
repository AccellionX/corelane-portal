"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  readTourStorage,
  TOUR_STEPS,
  writeTourStorage,
  type TourStep,
} from "@/lib/tour";
import { useCorelaneStore } from "@/lib/store";

interface TourContextValue {
  ready: boolean;
  showWelcome: boolean;
  tourActive: boolean;
  stepIndex: number;
  step: TourStep | null;
  startTour: () => void;
  skipWelcome: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  restartTour: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const setRole = useCorelaneStore((s) => s.setRole);
  const [ready, setReady] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const stored = readTourStorage();
    setShowWelcome(!stored.welcomeSeen);
    setReady(true);
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      const step = TOUR_STEPS[index];
      if (!step) return;
      if (step.requireAdmin) {
        setRole("Admin");
      }
      setStepIndex(index);
      router.push(step.href);
    },
    [router, setRole]
  );

  const startTour = useCallback(() => {
    writeTourStorage({ welcomeSeen: true });
    setShowWelcome(false);
    setTourActive(true);
    goToStep(0);
    toast.message("Tour started", { description: "Follow the tips - skip anytime." });
  }, [goToStep]);

  const skipWelcome = useCallback(() => {
    writeTourStorage({ welcomeSeen: true });
    setShowWelcome(false);
    toast.message("Explore freely - restart the tour from the Demo pill anytime.");
  }, []);

  const skipTour = useCallback(() => {
    setTourActive(false);
    writeTourStorage({ welcomeSeen: true, tourCompleted: false });
    toast.message("Tour skipped");
  }, []);

  const nextStep = useCallback(() => {
    const next = stepIndex + 1;
    if (next >= TOUR_STEPS.length) {
      setTourActive(false);
      writeTourStorage({ welcomeSeen: true, tourCompleted: true });
      toast.success("Tour complete", {
        description: "You can restart it anytime from the Demo pill.",
      });
      return;
    }
    goToStep(next);
  }, [goToStep, stepIndex]);

  const prevStep = useCallback(() => {
    if (stepIndex <= 0) return;
    goToStep(stepIndex - 1);
  }, [goToStep, stepIndex]);

  const restartTour = useCallback(() => {
    writeTourStorage({ welcomeSeen: true, tourCompleted: false });
    setShowWelcome(false);
    setTourActive(true);
    goToStep(0);
    toast.message("Restarting tour");
  }, [goToStep]);

  const value = useMemo(
    () => ({
      ready,
      showWelcome,
      tourActive,
      stepIndex,
      step: tourActive ? TOUR_STEPS[stepIndex] ?? null : null,
      startTour,
      skipWelcome,
      nextStep,
      prevStep,
      skipTour,
      restartTour,
    }),
    [
      ready,
      showWelcome,
      tourActive,
      stepIndex,
      startTour,
      skipWelcome,
      nextStep,
      prevStep,
      skipTour,
      restartTour,
    ]
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
}
