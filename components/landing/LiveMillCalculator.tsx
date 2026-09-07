"use client";

import React, { useState } from "react";
import { Calculator, Sparkles, ArrowRight, IndianRupee, Clock, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LiveMillCalculator() {
  const [wheatKg, setWheatKg] = useState<number>(3200);
  const [wheatRate, setWheatRate] = useState<number>(2.5);
  const [mustardKg, setMustardKg] = useState<number>(1000);
  const [mustardRate, setMustardRate] = useState<number>(5.0);

  // Calculations (30 days operating month)
  const dailyWheatRevenue = wheatKg * wheatRate;
  const dailyMustardRevenue = mustardKg * mustardRate;
  const dailyTotal = dailyWheatRevenue + dailyMustardRevenue;
  const monthlyRevenue = dailyTotal * 30;

  // Bran yield (~3.5% of wheat)
  const monthlyKhariYield = Math.round(wheatKg * 0.035 * 30);

  // Estimated unbilled credit leak prevented (~4.5% of ledger)
  const monthlyLeakageSaved = Math.round(monthlyRevenue * 0.045);

  // Hours saved in manual bookkeeping (~1.5 hours daily)
  const monthlyHoursSaved = 45;

  return (
    <section className="py-20 sm:py-28 bg-card border-t border-border/70 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="accent" className="gap-1.5 px-3.5 py-1 text-xs font-semibold">
            <Calculator className="h-3.5 w-3.5 text-primary" />
            Interactive ROI & Yield Estimator
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Calculate Your Mill’s <br className="hidden sm:inline" />
            <span className="text-primary">Monthly Potential & Yields</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Drag the sliders to match your daily capacity and see immediate estimates of your turnover, bran recovery, and unbilled credit leakage prevented.
          </p>
        </div>

        {/* Calculator Widget */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-border/80 bg-background/80 backdrop-blur-xl p-6 sm:p-10 shadow-[var(--card-shadow)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Sliders (7 cols) */}
          <div className="lg:col-span-7 space-y-7">

            {/* Slider 1: Wheat Daily */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <label className="font-semibold text-foreground flex items-center gap-2">
                  <span>Daily Wheat Grinding (Gehum)</span>
                </label>
                <span className="font-mono font-bold text-primary text-base">
                  {wheatKg.toLocaleString("en-IN")} kg/day
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={wheatKg}
                onChange={(e) => setWheatKg(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-secondary accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                <span>500 kg</span>
                <span>5,000 kg</span>
                <span>10,000 kg</span>
              </div>
            </div>

            {/* Slider 2: Wheat Rate */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <label className="font-semibold text-foreground">
                  Wheat Grinding Charge (Rate per kg)
                </label>
                <span className="font-mono font-bold text-foreground text-base">
                  ₹{wheatRate.toFixed(2)} / kg
                </span>
              </div>
              <input
                type="range"
                min="1.50"
                max="5.00"
                step="0.25"
                value={wheatRate}
                onChange={(e) => setWheatRate(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-secondary accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                <span>₹1.50</span>
                <span>₹3.25</span>
                <span>₹5.00</span>
              </div>
            </div>

            {/* Slider 3: Mustard Daily */}
            <div className="space-y-2.5 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between text-sm">
                <label className="font-semibold text-foreground">
                  Daily Mustard Expelling (Sarso)
                </label>
                <span className="font-mono font-bold text-primary text-base">
                  {mustardKg.toLocaleString("en-IN")} kg/day
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={mustardKg}
                onChange={(e) => setMustardKg(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-secondary accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                <span>0 kg</span>
                <span>2,500 kg</span>
                <span>5,000 kg</span>
              </div>
            </div>

          </div>

          {/* Right: Live Calculation Output Card (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-primary/25 bg-primary/5 p-6 sm:p-7 space-y-6">

            <div>
              <span className="text-[11px] uppercase font-mono tracking-wider text-muted-foreground block">
                Estimated Monthly Turnover
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground font-mono mt-1">
                ₹{monthlyRevenue.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Based on 30 operational milling days
              </p>
            </div>

            {/* Value cards */}
            <div className="space-y-3 pt-2 border-t border-primary/20">

              <div className="p-3 rounded-xl bg-card border border-border/70 flex items-center justify-between text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Monthly Khari (Bran) Yield</span>
                  <strong className="text-foreground font-mono text-sm">{monthlyKhariYield.toLocaleString("en-IN")} kg</strong>
                </div>
                <Badge variant="accent" className="text-[10px]">By-product</Badge>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border/70 flex items-center justify-between text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Lost Credit Recovered</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">~₹{monthlyLeakageSaved.toLocaleString("en-IN")}</strong>
                </div>
                <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">Zero Leak</Badge>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border/70 flex items-center justify-between text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Manual Bookkeeping Saved</span>
                  <strong className="text-primary font-mono text-sm">~{monthlyHoursSaved} Hours / mo</strong>
                </div>
                <span className="text-xs font-mono text-muted-foreground">1.5h daily</span>
              </div>

            </div>

            <Link
              href="/mill-data"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary py-3 px-4 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
            >
              <span>Record This Volume in MillDiary</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}
