"use client";

import { useEffect, useState } from "react";
import { useCorelaneStore } from "@/lib/store";

/** Brief skeleton flash after mount / store hydration for polished UX */
export function useSimulatedLoading(ms = 450) {
  const hydrated = useCorelaneStore((s) => s.hydrated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) {
      setLoading(true);
      return;
    }
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), ms);
    return () => window.clearTimeout(t);
  }, [hydrated, ms]);

  return loading;
}
