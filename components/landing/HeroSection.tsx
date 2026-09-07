"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Database,
  ScanLine,
  CheckCircle2,
  Sparkles,
  Play,
  Scale,
  NotebookText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MillDiaryMark } from "@/components/ui/logo";

export function HeroSection() {
  const scrollToWorkflow = () => {
    const el = document.getElementById("interactive-workflow");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-background pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24">
      {/* Background Decorative Layer */}
      <div className="pointer-events-none absolute inset-0">
        {/* Subtle geometric grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(39,35,32,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(39,35,32,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[36px_36px]" />
        {/* Warm copper radial ambient glow */}
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-primary/15 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Value Proposition & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Version & Capability Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary shadow-2xs backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Next-Gen Mill Operating System • AI Slip OCR Studio</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-foreground leading-[1.15]">
              Accurate, Organized and <br />
              <span className="text-primary underline decoration-primary/30 decoration-wavy decoration-2">
                Effortless Mill Accounting
              </span>
            </h1>

            {/* Subheading */}
            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground mx-auto lg:mx-0">
              Built specifically for flour and oil mill owners. Replace chaotic paper registers and lost customer slips with instant digital ledgers, automatic bran (khari) yields, and clean separation of mill debits from home expenses.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/mill-data"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_4px_16px_rgba(166,83,46,0.30)] dark:shadow-[0_4px_18px_rgba(214,135,95,0.25)] hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <span>Launch Mill Ledger</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                onClick={scrollToWorkflow}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border/80 bg-card px-7 py-3.5 text-sm font-semibold text-foreground shadow-2xs hover:bg-secondary active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <Play className="h-4 w-4 fill-primary text-primary" />
                <span>See Interactive Workflow</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>100% Offline-Ready PWA</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Hindi & English Transliteration</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>1-Click Excel Reports</span>
              </div>
            </div>

          </div>

          {/* Right Column: Live Glassmorphic Product Preview Card (5 cols) */}
          <div className="lg:col-span-5 relative">
            {/* Ambient backdrop glow */}
            <div className="absolute -inset-1 rounded-3xl bg-linear-to-tr from-primary/30 to-secondary blur-xl opacity-60 pointer-events-none" />

            {/* Dashboard Mockup Card */}
            <div className="relative rounded-2xl border border-border/80 bg-card/90 backdrop-blur-xl p-6 shadow-[var(--card-shadow)] space-y-5">
              
              {/* Card Header with Status */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <MillDiaryMark className="h-8 w-8" />
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Mill Diary Console</h3>
                    <p className="text-[11px] text-muted-foreground">Active Daily Grinding Register</p>
                  </div>
                </div>
                <Badge variant="accent" className="text-[10px] font-semibold">
                  Live Syncing
                </Badge>
              </div>

              {/* Stat Metric Pills */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-border/70 bg-secondary/30 space-y-1">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Today&apos;s Wheat
                  </span>
                  <div className="text-lg font-bold text-foreground font-mono">
                    3,840 <span className="text-xs font-normal text-muted-foreground">kg</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ↑ 18 Slips Processed
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-border/70 bg-secondary/30 space-y-1">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Today&apos;s Mustard
                  </span>
                  <div className="text-lg font-bold text-foreground font-mono">
                    1,220 <span className="text-xs font-normal text-muted-foreground">kg</span>
                  </div>
                  <div className="text-[10px] text-primary font-medium">
                    ~412 Ltr Oil Yield
                  </div>
                </div>
              </div>

              {/* Live Slip Extraction Simulation Card */}
              <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <ScanLine className="h-3.5 w-3.5 text-primary" />
                    Latest OCR Slip Intake
                  </span>
                  <span className="text-[10px] font-mono text-primary font-bold">SLIP #1042</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-[11px] bg-card p-2 rounded-lg border border-border/60">
                  <div>
                    <span className="text-[9px] text-muted-foreground block">Customer</span>
                    <strong className="text-foreground">Ram Lal</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground block">Village</span>
                    <span className="text-foreground font-medium">Rampur</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-muted-foreground block">Net Weight</span>
                    <strong className="text-primary font-mono">120 kg</strong>
                  </div>
                </div>
              </div>

              {/* Financial Summary Strip */}
              <div className="p-3 rounded-xl border border-border/60 bg-secondary/40 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Cash Collected</span>
                  <span className="text-sm font-bold text-foreground font-mono">₹18,450</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">Net Daily Balance</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">+ ₹12,830</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Global Impact Numbers Bar */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-border/60 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-mono">
              ₹10Cr+
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">
              Grains & Ledgers Managed
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-mono">
              500+
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">
              Active Mill Owners
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight font-mono">
              0%
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">
              Tare & Weight Rounding Loss
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-mono">
              100%
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">
              Offline PWA Reliability
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
