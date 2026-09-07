"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Banner Card */}
        <div className="relative rounded-3xl border border-primary/30 bg-linear-to-br from-card via-card to-primary/10 p-8 sm:p-14 shadow-[var(--card-shadow)] overflow-hidden text-center space-y-8">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-primary/20 blur-[100px]" />

          <div className="relative max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ready for Immediate Use</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Start Modernizing Your Mill&apos;s <br />
              <span className="text-primary">Daily Grinding Ledger Today</span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Join forward-thinking flour and oil mill owners who have replaced lost paper slips and manual math with real-time digital accounting.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-[0_4px_16px_rgba(166,83,46,0.35)] dark:shadow-[0_4px_18px_rgba(214,135,95,0.30)] hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <span>Create Free Account</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border/80 bg-card px-8 py-4 text-sm font-semibold text-foreground shadow-2xs hover:bg-secondary active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <span>Explore Dashboard</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="relative pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Free 30-Day Evaluation
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Full Offline Support
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
