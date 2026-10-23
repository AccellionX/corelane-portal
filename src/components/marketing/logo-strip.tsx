const LOGOS = [
  "Northwind",
  "Harbor & Co",
  "Brightline",
  "Cedar Ops",
  "Atlas Freight",
  "Meridian",
];

export function LogoStrip() {
  return (
    <section className="border-y border-border/60 bg-zinc-50/60 py-10 dark:bg-zinc-950/40">
      <div className="page-shell">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by operators at
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
          {LOGOS.map((name) => (
            <span
              key={name}
              className="text-sm font-semibold tracking-tight text-zinc-400 dark:text-zinc-500 sm:text-base"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
