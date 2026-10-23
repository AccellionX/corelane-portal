import { cn } from "@/lib/utils";

export function Logo({ className, markOnly }: { className?: string; markOnly?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)]">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
          <path
            d="M4 14c3.5-1 5.5-4 8-4s4.5 3 8 4"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M4 10c3.5 1 5.5 4 8 4s4.5-3 8-4"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      </span>
      {!markOnly && (
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Corelane
        </span>
      )}
    </div>
  );
}
