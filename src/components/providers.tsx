"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { TourProvider } from "@/components/tour/tour-context";
import { WelcomeModal } from "@/components/tour/welcome-modal";
import { TourOverlay } from "@/components/tour/tour-overlay";
import { useCorelaneStore } from "@/lib/store";

function StoreHydration() {
  const setHydrated = useCorelaneStore((s) => s.setHydrated);

  useEffect(() => {
    useCorelaneStore.persist.rehydrate();
    setHydrated(true);
  }, [setHydrated]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TourProvider>
        <StoreHydration />
        {children}
        <WelcomeModal />
        <TourOverlay />
        <Toaster richColors position="top-center" closeButton />
      </TourProvider>
    </ThemeProvider>
  );
}
