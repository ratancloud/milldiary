import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Wheat,
  Scale,
  ShieldCheck,
  Zap,
  TrendingUp,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Split,
  FileSpreadsheet,
  ScanLine,
  HeartHandshake,
  Home,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "About Us | Mill Diary",
  description:
    "Learn about Mill Diary's mission to empower flour and oil mill owners across India with digital grinding ledgers, automated bran yields, and clean accounting.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">

      {/* 1. Hero Header */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-border/70 bg-background">
        {/* Background decorative grid & glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(39,35,32,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(39,35,32,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[36px_36px]" />
          <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/15 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Our Mission & Origins</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] max-w-4xl mx-auto">
              Digitizing the Heart of <br className="hidden sm:inline" />
              <span className="text-primary underline decoration-primary/30 decoration-wavy decoration-2">
                India&apos;s Grain & Milling Economy
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
              For decades, local flour mills (Aata Chakki) and oil expellers (Sarso Pesi) have powered rural and semi-urban communities — while trapped in manual registers, lost paper chits, and chaotic credit notebooks. Mill Diary was created to change that forever.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Built for Real Indian Mill Workflows
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Zero Accounting Jargon
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                100% Offline PWA Resilience
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--card-shadow)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-foreground font-mono">₹10Cr+</div>
              <div className="text-xs text-muted-foreground">Grain Volume Tracked</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--card-shadow)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-foreground font-mono">500+</div>
              <div className="text-xs text-muted-foreground">Active Mill Owners & Operators</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--card-shadow)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-foreground font-mono">100%</div>
              <div className="text-xs text-muted-foreground">Private & Secure Cloud Vault</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Story & Problem We Solve */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <Badge variant="accent" className="font-semibold text-xs">
              The Genesis
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Why Traditional Accounting Fails the Modern Mill Owner
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              Standard accounting software is built for corporate invoices and retail shops. It assumes desk jobs, keyboards, and complex debit-credit balances.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              A mill is fundamentally different. It runs in a loud, dusty environment where grain sacks are weighed in real-time, customers speak local dialects, by-products like bran (khari) and oilcake must be deducted automatically, and rural power cuts are common.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Mill Diary was built directly from the ground floor of real Indian mills. We replaced paper registers with quick Hindi transliteration, slip camera scans, and automatic cash-vs-credit balancing that anyone can use in seconds.
            </p>

            <div className="pt-2">
              <Link
                href="/mill-data"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_4px_16px_rgba(166,83,46,0.30)] hover:bg-primary/90 transition-all cursor-pointer active:scale-[0.98]"
              >
                <span>Experience the Platform</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Bento Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--card-shadow)] space-y-3">
              <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <Scale className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Precision Weight & Tare</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Auto-deduct sack weights (tare) and compute net milling charges down to the exact 100 grams without rounding disputes.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--card-shadow)] space-y-3">
              <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <Split className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Dual Debit Isolation</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Keep mill operating costs (electricity, diesel, worker wages) 100% separate from household grocery withdrawals.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--card-shadow)] space-y-3">
              <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <ScanLine className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Instant Slip OCR</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Snap photos of paper receipts with a phone camera. AI extracts names, crops, and weights with zero typing.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--card-shadow)] space-y-3">
              <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">1-Click Excel Reports</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Export daily or monthly data into structured Excel spreadsheets ready for accountants, tax filings, and bank audits.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Core Values */}
      <section className="border-t border-border/70 bg-card py-20 sm:py-28 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="accent" className="text-xs font-semibold">Our Principles</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              What Drives Every Line of Code
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              We design specifically for real-world operating conditions, not imaginary corporate offices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-7 rounded-2xl border border-border/80 bg-background/70 space-y-3 shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Respect the Miller&apos;s Time</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                During harvesting seasons, millers handle hundreds of farmers every morning. Every interaction in Mill Diary is designed for speed — minimum clicks, keyboard shortcuts, and instant Hindi suggestions.
              </p>
            </div>

            <div className="p-7 rounded-2xl border border-border/80 bg-background/70 space-y-3 shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Offline-First Reliability</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Rural internet drops frequently. Mill Diary functions completely offline on any smartphone or tablet as a Progressive Web App (PWA), automatically syncing whenever connectivity restores.
              </p>
            </div>

            <div className="p-7 rounded-2xl border border-border/80 bg-background/70 space-y-3 shadow-2xs">
              <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Absolute Data Sovereignty</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Your business data is strictly private. We do not sell or monetize customer khata information. Your ledgers belong solely to you, with one-click export at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Closing CTA */}
      <section className="py-16 sm:py-24 bg-background text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Ready to Bring Order to Your Mill&apos;s Daily Ledger?
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Join hundreds of flour and oil mill owners who have replaced lost paper slips with clear, effortless digital records.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_4px_16px_rgba(166,83,46,0.30)] hover:bg-primary/90 transition-all cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border/80 bg-card px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-secondary transition-all cursor-pointer"
            >
              <span>Talk to Our Team</span>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}