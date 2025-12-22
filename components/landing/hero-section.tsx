import {
  BarChart3,
  FileSpreadsheet,
  LucideProps,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* ---------- BACKGROUND DECORATION ---------- */}
      <div className="pointer-events-none absolute inset-0">
        {/* Soft grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),
             linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[32px_32px]" />

        {/* Gradient glow */}
        <div className="absolute -top-24 left-1/2 h-105 w-105 -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      </div>

      {/* ---------- CONTENT ---------- */}
      <div className="relative mx-auto max-w-7xl px-6 py-14 sm:py-28">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* ================= LEFT ================= */}
          <div className="space-y-7">

            {/* Tag */}
            <span className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <Wallet className="h-4 w-4 text-primary" />
              Accounting & Expense Management for Mills
            </span>

            {/* Heading */}
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem] leading-tight">
              Accurate, Organized and
              <span className="block text-primary">
                Reliable Mill Accounting
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              MillDiary is built for mill owners who want clear records of daily
              credits, expenses, materials, and savings — without complex
              accounting software.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-md bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
              >
                Start Using MillDiary
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md bg-primary/20 border border-primary/20 px-7 py-3.5 text-sm font-medium"
              >
                View Dashboard
              </Link>
            </div>

            {/* Trust */}
            <p className="text-xs text-muted-foreground">
              Designed for flour mills, oil mills & small manufacturing units
            </p>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="relative">

            {/* Card stack effect */}
            <div className="absolute -top-6 right-6 h-full w-full rounded-2xl bg-muted/40" />
            <div className="absolute -top-3 right-3 h-full w-full rounded-2xl bg-muted/60" />

            {/* Main card */}
            <div className="relative rounded-2xl border bg-card p-6 lg:p-8 shadow-sm space-y-6">

              <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Key Capabilities
              </h3>

              <InfoRow
                icon={BarChart3}
                title="Daily & Monthly Overview"
                description="Track credits, debits, and savings with clarity."
              />

              <InfoRow
                icon={FileSpreadsheet}
                title="Material-Based Records"
                description="Flour, Oil, Sarso, Gehum with weight & value."
              />

              <InfoRow
                icon={ShieldCheck}
                title="Private & Secure"
                description="Only you can access your business data."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow ({
  icon: Icon,
  title,
  description,
}: {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

