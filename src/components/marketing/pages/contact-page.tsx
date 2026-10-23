"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormState = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const empty: FormState = { name: "", email: "", company: "", message: "" };

export function ContactPage() {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid work email.";
    }
    if (form.message.trim().length < 20) {
      next.message = "Message should be at least 20 characters.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Check the form", { description: "Fix the highlighted fields and try again." });
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      toast.success("Message sent", {
        description: "Thanks - this is a mock demo. We'll pretend to follow up shortly.",
      });
      setForm(empty);
      setErrors({});
      setSubmitting(false);
    }, 400);
  };

  return (
    <>
      <section className="gradient-mesh border-b border-border/60">
        <div className="page-shell section-space pb-12 sm:pb-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Contact</p>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Tell us about your lanes
            </h1>
            <p className="mt-5 text-pretty text-lg text-muted-foreground">
              Mock form with validation and a success toast - no emails leave this demo.
            </p>
          </div>
        </div>
      </section>

      <section className="section-space pt-10 sm:pt-12">
        <div className="page-shell">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">What to expect</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Share how you run bookings and billing today. In a real product this would route to
                sales - here it validates locally and confirms with Sonner.
              </p>
              <div className="surface-card space-y-3 p-5 text-sm">
                <p>
                  <span className="font-medium">Email</span>
                  <span className="mt-0.5 block text-muted-foreground">hello@corelane.demo</span>
                </p>
                <p>
                  <span className="font-medium">Hours</span>
                  <span className="mt-0.5 block text-muted-foreground">
                    Mon-Fri, 9am-6pm PT (demo timezone)
                  </span>
                </p>
              </div>
            </div>

            <form
              onSubmit={onSubmit}
              noValidate
              className="surface-card space-y-4 p-6 sm:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={set("name")}
                    className="rounded-xl"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className="text-xs text-rose-600">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    className="rounded-xl"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="text-xs text-rose-600">{errors.email}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company (optional)</Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={set("company")}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={set("message")}
                  placeholder="What are you trying to operate today?"
                  aria-invalid={!!errors.message}
                />
                {errors.message && <p className="text-xs text-rose-600">{errors.message}</p>}
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 sm:w-auto"
              >
                {submitting ? "Sending…" : "Send message"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
