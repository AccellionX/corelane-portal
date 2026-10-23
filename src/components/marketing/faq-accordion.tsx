"use client";

import { ChevronDown } from "lucide-react";
import { useCorelaneStore } from "@/lib/store";

export function FaqAccordion({ limit }: { limit?: number }) {
  const faq = useCorelaneStore((s) => s.content.faq);
  const items = typeof limit === "number" ? faq.slice(0, limit) : faq;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.id} className="group surface-card overflow-hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium sm:px-6 sm:py-5">
            <span className="pr-2">{item.question}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
          </summary>
          <p className="border-t border-border/60 px-5 py-4 text-sm leading-relaxed text-muted-foreground sm:px-6">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
