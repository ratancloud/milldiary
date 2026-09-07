"use client";

import React from "react";
import {
  ScanLine,
  Languages,
  Split,
  Wheat,
  FileSpreadsheet,
  WifiOff,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function BentoFeatures() {
  return (
    <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="accent" className="gap-1.5 px-3.5 py-1 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Engineered For Flour & Oil Mills
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Everything Required to Operate <br className="hidden sm:inline" />
            <span className="text-primary">a Modern, Profitable Mill</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Eliminate paperwork, speed up customer queues, and know your exact net daily earnings at a glance.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: AI Slip OCR Studio (8 cols) */}
          <div className="md:col-span-8 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-[var(--card-shadow)] hover:shadow-[var(--card-hover-shadow)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                  <ScanLine className="h-5 w-5" />
                </div>
                <Badge variant="accent" className="text-xs">AI Studio</Badge>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Camera-Based Slip OCR Scanner
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                Don&apos;t waste time typing every slip manually during busy morning rushes. Take a photo of handwritten chits and let Mill Diary extract customer names, crop type, and kilograms in seconds.
              </p>
            </div>

            {/* Visual simulation preview of OCR sweep */}
            <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 sm:p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-border/60">
                <span className="font-mono text-primary font-bold">OCR SCANNING SIMULATION</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Ready for intake
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Customer</span>
                  <strong className="text-foreground">Dharmendra S.</strong>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block">Village</span>
                  <span className="text-foreground font-medium">Bhopalgarh</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block">Crop</span>
                  <span className="text-primary font-medium">Wheat (Gehum)</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block">Weight</span>
                  <strong className="text-foreground font-mono">240 kg</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Hindi & English Transliteration (4 cols) */}
          <div className="md:col-span-4 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-[var(--card-shadow)] hover:shadow-[var(--card-hover-shadow)] transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-secondary text-primary flex items-center justify-center border border-border/60">
                <Languages className="h-5 w-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                Hindi Transliteration & Village Suggestions
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Type names in English phonetics (e.g. &apos;Suresh&apos;) and see them convert automatically into Hindi (&apos;सुरेश&apos;) while matching historical village records.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border/70 bg-secondary/40 text-xs space-y-1 font-mono">
              <div className="text-muted-foreground text-[11px]">Typing: &quot;ramesh rampur&quot;</div>
              <div className="text-foreground font-semibold flex items-center gap-2">
                <span>→ रमेश</span>
                <span className="text-primary font-sans font-bold bg-primary/10 px-2 py-0.5 rounded text-[10px]">
                  रामपुर
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Dual Debit Isolation (4 cols) */}
          <div className="md:col-span-4 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-[var(--card-shadow)] hover:shadow-[var(--card-hover-shadow)] transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-secondary text-primary flex items-center justify-center border border-border/60">
                <Split className="h-5 w-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                Mill Debit vs Home Debit
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Never mix personal household grocery money with mill electricity, diesel, or worker wages. Clear dual tracking keeps accounting crystal clear.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg border border-border/60 bg-secondary/30 flex justify-between">
                <span className="text-muted-foreground">Mill Diesel & Labor:</span>
                <strong className="text-foreground font-mono">₹3,400 (Mill Debit)</strong>
              </div>
              <div className="p-2.5 rounded-lg border border-border/60 bg-secondary/30 flex justify-between">
                <span className="text-muted-foreground">Home Ration Drawing:</span>
                <strong className="text-primary font-mono">₹1,200 (Home Debit)</strong>
              </div>
            </div>
          </div>

          {/* Card 4: Multi-Crop Processing & Bran Yields (4 cols) */}
          <div className="md:col-span-4 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-[var(--card-shadow)] hover:shadow-[var(--card-hover-shadow)] transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-secondary text-primary flex items-center justify-center border border-border/60">
                <Wheat className="h-5 w-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                Multi-Crop & Bran Yield Tracking
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Wheat, Mustard, Oil expelling, and Bran (Khari) yield logs with custom mill deduction rules (katauti) tailored to your region.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-center">
              <div className="p-2.5 rounded-lg border border-border/60 bg-secondary/40">
                <div className="text-[10px] text-muted-foreground">Wheat Flour</div>
                <div className="font-bold text-foreground font-mono">Atta + Khari</div>
              </div>
              <div className="p-2.5 rounded-lg border border-border/60 bg-secondary/40">
                <div className="text-[10px] text-muted-foreground">Mustard</div>
                <div className="font-bold text-primary font-mono">Tel + Khalli</div>
              </div>
            </div>
          </div>

          {/* Card 5: Offline PWA & 1-Click Excel Export (4 cols) */}
          <div className="md:col-span-4 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-[var(--card-shadow)] hover:shadow-[var(--card-hover-shadow)] transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-secondary text-primary flex items-center justify-center border border-border/60">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                1-Click Excel Export & Offline PWA
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Rural internet down? Mill Diary keeps recording uninterrupted. When finished, export audit-ready Excel spreadsheets with one tap.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex-1 p-2.5 rounded-lg border border-border/60 bg-secondary/30 text-center">
                <WifiOff className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                <span className="text-[11px] font-medium text-foreground">Works Offline</span>
              </div>
              <div className="flex-1 p-2.5 rounded-lg border border-primary/30 bg-primary/5 text-center">
                <FileSpreadsheet className="h-4 w-4 text-primary mx-auto mb-1" />
                <span className="text-[11px] font-bold text-primary">Excel Ready</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
