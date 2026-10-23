import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta({
  title = "Ready to run every lane from one place?",
  description = "Spin up a workspace in minutes. Demo auth is mock - continue straight into the customer dashboard.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="section-space border-t border-border/60">
      <div className="page-shell">
        <div className="surface-card overflow-hidden gradient-mesh px-6 py-12 text-center sm:px-10 sm:py-16">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            {description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-xl bg-indigo-600 px-6 hover:bg-indigo-500">
              <Link href="/signup">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl">
              <Link href="/contact">Talk to us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
