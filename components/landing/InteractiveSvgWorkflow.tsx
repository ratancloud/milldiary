"use client";

import React, { useState, useEffect } from "react";
import {
  Scale,
  ScanLine,
  Cog,
  Coins,
  BarChart3,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Wheat,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StageInfo {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  metrics: { label: string; value: string }[];
  details: string[];
}

const STAGES: StageInfo[] = [
  {
    id: 0,
    title: "1. Grain Intake & Digital Weighing",
    subtitle: "Precise measurement without loss",
    badge: "Input Stage",
    icon: Scale,
    description:
      "Village farmers bring raw wheat and mustard crops. The mill operator records Gross Weight, Tare (bag weight), and Net Weight with zero rounding errors.",
    metrics: [
      { label: "Net Wheat Logged", value: "3,840 kg" },
      { label: "Net Mustard Logged", value: "1,220 kg" },
      { label: "Tare Deductions", value: "100% Exact" },
    ],
    details: [
      "Auto-deduct bag weight (1 kg per bori)",
      "Supports multiple sacks in single entry",
      "Assigns entry to customer village profile",
    ],
  },
  {
    id: 1,
    title: "2. OCR Slip Scan & Smart Ledger",
    subtitle: "Camera scan or instant Hindi transliteration",
    badge: "AI Intake",
    icon: ScanLine,
    description:
      "Operator takes a quick photo of the paper receipt or types customer name in English — MillDiary instantly transliterates to Hindi and matches the village.",
    metrics: [
      { label: "OCR Scan Speed", value: "< 1.2s" },
      { label: "Hindi Transliteration", value: "Real-time" },
      { label: "Duplicate Slip Check", value: "Automated" },
    ],
    details: [
      "AI extracts customer name, crop type, and kilograms",
      "Village autocomplete from past history",
      "Eliminates missing paper slips and manual re-entry",
    ],
  },
  {
    id: 2,
    title: "3. Milling & By-product Yield",
    subtitle: "Automated flour, oil, bran & cake conversion",
    badge: "Processing",
    icon: Cog,
    description:
      "During grinding and expelling, raw grains convert into primary and secondary goods. MillDiary calculates the exact bran (khari) and oilcake deductions.",
    metrics: [
      { label: "Atta (Flour) Ratio", value: "96.5%" },
      { label: "Khari (Bran) Yield", value: "3.5%" },
      { label: "Oil Recovery Rate", value: "33.8%" },
    ],
    details: [
      "Automatic deduction for mill retention (katauti)",
      "Real-time tracking of oil expeller batches",
      "Inventory alerts for customer bran collection",
    ],
  },
  {
    id: 3,
    title: "4. Cash, Credit & Debit Separation",
    subtitle: "Separate mill costs from personal expenses",
    badge: "Financial Core",
    icon: Coins,
    description:
      "Charges are calculated automatically at your mill's custom rate (e.g. ₹2.50/kg). Cash received and village credit (udhar) are instantly balanced.",
    metrics: [
      { label: "Cash Collected", value: "₹18,450" },
      { label: "Village Credit Dues", value: "₹4,120" },
      { label: "Mill vs Home Split", value: "100% Isolated" },
    ],
    details: [
      "Isolates electricity/labor expenses from household grocery withdrawals",
      "Instant customer khata summary with one tap",
      "Daily closing balance verified with cash drawer",
    ],
  },
  {
    id: 4,
    title: "5. Real-Time Dashboard & Excel Export",
    subtitle: "Actionable analytics & audit-ready records",
    badge: "Analytics",
    icon: BarChart3,
    description:
      "End-of-day summary reports show daily income, expenses, and net profit. One click exports the entire ledger into clean Excel sheets for accountants.",
    metrics: [
      { label: "Daily Net Profit", value: "+ ₹12,830" },
      { label: "Offline Storage", value: "100% Local" },
      { label: "Excel Export", value: "1-Click" },
    ],
    details: [
      "Visual charts of grain trends across days and months",
      "Works fully offline during rural network blackouts",
      "Export formatted Excel sheets with all customer slips",
    ],
  },
];

export function InteractiveSvgWorkflow() {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // Simulation auto-advancer
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setActiveStage((prev) => {
        if (prev >= STAGES.length - 1) {
          setIsSimulating(false);
          return 0;
        }
        return prev + 1;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const currentStage = STAGES[activeStage];

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-card border-y border-border/70">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[140px] opacity-70" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="accent" className="gap-1.5 px-3.5 py-1 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Interactive Engine Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            How Mill Diary Transforms <br className="hidden sm:inline" />
            <span className="text-primary">Raw Grain into Clean Accounting</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Click on any processing stage below or launch the live simulation to discover
            how Mill Diary replaces paper registers, calculates accurate conversion yields,
            and secures your mill’s profit.
          </p>

          {/* Simulation Trigger Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => setIsSimulating(!isSimulating)}
              variant={isSimulating ? "secondary" : "default"}
              size="sm"
              className="gap-2 shadow-sm font-semibold"
            >
              {isSimulating ? (
                <>
                  <RotateCcw className="h-4 w-4 animate-spin text-primary" />
                  Simulating Workflow (Click to Pause)
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
                  Run Live Day Simulation
                </>
              )}
            </Button>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Stage {activeStage + 1} of 5: <span className="font-semibold text-foreground">{currentStage.title}</span>
            </span>
          </div>
        </div>

        {/* Stage Navigation Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {STAGES.map((s, idx) => {
            const Icon = s.icon;
            const isActive = activeStage === idx;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setIsSimulating(false);
                  setActiveStage(idx);
                }}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 cursor-pointer select-none active:scale-[0.98]",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(166,83,46,0.25)] font-semibold"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-primary")} />
                <span>{s.title.split(". ")[1]}</span>
              </button>
            );
          })}
        </div>

        {/* The Star Interactive Canvas (SVG Pipeline + Inspector Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left / Main: The Interactive SVG Graphic (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-border/80 bg-background/70 backdrop-blur-md p-4 sm:p-6 shadow-[var(--card-shadow)] relative overflow-hidden min-h-[380px] sm:min-h-[440px]">
            {/* Ambient Watermark */}
            <div className="absolute top-3 right-4 text-[10px] uppercase font-mono tracking-widest text-muted-foreground/60 select-none">
              Interactive Mill Pipeline • Vector Canvas
            </div>

            {/* SVG Canvas */}
            <div className="w-full flex-1 flex items-center justify-center relative py-4">
              <svg
                viewBox="0 0 760 380"
                className="w-full h-auto max-h-[360px] drop-shadow-xs"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Defs: Gradients and Markers */}
                <defs>
                  <linearGradient id="copperLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="var(--primary)" stopOpacity="1" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.8" />
                  </linearGradient>

                  <linearGradient id="glowNodeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.05" />
                  </linearGradient>

                  <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Background Connecting Rails */}
                <path
                  d="M 80 190 C 180 190, 180 110, 240 110 C 300 110, 300 190, 380 190 C 460 190, 460 270, 520 270 C 580 270, 580 190, 680 190"
                  stroke="var(--border)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.6"
                />

                {/* Animated Copper Signal Conduit */}
                <path
                  d="M 80 190 C 180 190, 180 110, 240 110 C 300 110, 300 190, 380 190 C 460 190, 460 270, 520 270 C 580 270, 580 190, 680 190"
                  stroke="url(#copperLineGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="8 6"
                  className="animate-[dash_15s_linear_infinite]"
                />

                {/* Moving Pulse Particle when Simulating */}
                {isSimulating && (
                  <circle
                    r="6"
                    fill="var(--primary)"
                    className="transition-all duration-700 ease-out shadow-lg"
                    style={{
                      transformOrigin: "center",
                      filter: "drop-shadow(0 0 8px var(--primary))",
                    }}
                    cx={
                      activeStage === 0
                        ? 80
                        : activeStage === 1
                          ? 240
                          : activeStage === 2
                            ? 380
                            : activeStage === 3
                              ? 520
                              : 680
                    }
                    cy={
                      activeStage === 0
                        ? 190
                        : activeStage === 1
                          ? 110
                          : activeStage === 2
                            ? 190
                            : activeStage === 3
                              ? 270
                              : 190
                    }
                  />
                )}

                {/* ============================================================== */}
                {/* NODE 0: WEIGHING SCALE (x: 80, y: 190) */}
                {/* ============================================================== */}
                <g
                  onClick={() => {
                    setIsSimulating(false);
                    setActiveStage(0);
                  }}
                  onMouseEnter={() => setHoveredNode(0)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer transition-transform duration-200 hover:scale-105"
                >
                  <circle
                    cx="80"
                    cy="190"
                    r={activeStage === 0 ? "46" : "38"}
                    fill="url(#glowNodeGrad)"
                    stroke={activeStage === 0 ? "var(--primary)" : "var(--border)"}
                    strokeWidth={activeStage === 0 ? "3" : "1.5"}
                    filter={activeStage === 0 ? "url(#softGlow)" : undefined}
                    className="transition-all duration-300"
                  />
                  <circle cx="80" cy="190" r="28" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                  {/* Scale Icon */}
                  <g transform="translate(68, 178)" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                    <path d="M7 21h10" />
                    <path d="M12 3v18" />
                    <path d="M3 7h18" />
                  </g>
                  <text x="80" y="250" textAnchor="middle" fill="var(--foreground)" fontSize="11" fontWeight="700">
                    Weighing
                  </text>
                  <text x="80" y="265" textAnchor="middle" fill="var(--muted-foreground)" fontSize="9">
                    Gross / Net KG
                  </text>
                </g>

                {/* ============================================================== */}
                {/* NODE 1: OCR SCANNER (x: 240, y: 110) */}
                {/* ============================================================== */}
                <g
                  onClick={() => {
                    setIsSimulating(false);
                    setActiveStage(1);
                  }}
                  onMouseEnter={() => setHoveredNode(1)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer transition-transform duration-200 hover:scale-105"
                >
                  <circle
                    cx="240"
                    cy="110"
                    r={activeStage === 1 ? "46" : "38"}
                    fill="url(#glowNodeGrad)"
                    stroke={activeStage === 1 ? "var(--primary)" : "var(--border)"}
                    strokeWidth={activeStage === 1 ? "3" : "1.5"}
                    filter={activeStage === 1 ? "url(#softGlow)" : undefined}
                    className="transition-all duration-300"
                  />
                  <circle cx="240" cy="110" r="28" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                  {/* Scan Document Icon */}
                  <g transform="translate(228, 98)" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                    <line x1="7" y1="12" x2="17" y2="12" />
                  </g>
                  <text x="240" y="170" textAnchor="middle" fill="var(--foreground)" fontSize="11" fontWeight="700">
                    AI Slip OCR
                  </text>
                  <text x="240" y="185" textAnchor="middle" fill="var(--muted-foreground)" fontSize="9">
                    Photo & Hindi
                  </text>
                </g>

                {/* ============================================================== */}
                {/* NODE 2: MILLING ENGINE (x: 380, y: 190) */}
                {/* ============================================================== */}
                <g
                  onClick={() => {
                    setIsSimulating(false);
                    setActiveStage(2);
                  }}
                  onMouseEnter={() => setHoveredNode(2)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer transition-transform duration-200 hover:scale-105"
                >
                  <circle
                    cx="380"
                    cy="190"
                    r={activeStage === 2 ? "48" : "40"}
                    fill="url(#glowNodeGrad)"
                    stroke={activeStage === 2 ? "var(--primary)" : "var(--border)"}
                    strokeWidth={activeStage === 2 ? "3.5" : "1.5"}
                    filter={activeStage === 2 ? "url(#softGlow)" : undefined}
                    className="transition-all duration-300"
                  />
                  <circle cx="380" cy="190" r="30" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                  {/* Milling Gear Icon with subtle rotation */}
                  <g
                    transform="translate(368, 178)"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={activeStage === 2 ? "animate-spin [animation-duration:8s]" : ""}
                    style={{ transformOrigin: "12px 12px" }}
                  >
                    <path d="M12 2v20" opacity="0.2" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </g>
                  <text x="380" y="254" textAnchor="middle" fill="var(--foreground)" fontSize="11" fontWeight="700">
                    Milling Engine
                  </text>
                  <text x="380" y="269" textAnchor="middle" fill="var(--muted-foreground)" fontSize="9">
                    Flour & Bran Yield
                  </text>
                </g>

                {/* ============================================================== */}
                {/* NODE 3: DUAL LEDGER & DEBITS (x: 520, y: 270) */}
                {/* ============================================================== */}
                <g
                  onClick={() => {
                    setIsSimulating(false);
                    setActiveStage(3);
                  }}
                  onMouseEnter={() => setHoveredNode(3)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer transition-transform duration-200 hover:scale-105"
                >
                  <circle
                    cx="520"
                    cy="270"
                    r={activeStage === 3 ? "46" : "38"}
                    fill="url(#glowNodeGrad)"
                    stroke={activeStage === 3 ? "var(--primary)" : "var(--border)"}
                    strokeWidth={activeStage === 3 ? "3" : "1.5"}
                    filter={activeStage === 3 ? "url(#softGlow)" : undefined}
                    className="transition-all duration-300"
                  />
                  <circle cx="520" cy="270" r="28" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                  {/* Coins / Ledger Icon */}
                  <g transform="translate(508, 258)" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8" cy="8" r="7" />
                    <path d="M19.5 10.5c.3.5.5 1.1.5 1.5a8 8 0 1 1-8-8c.5 0 1 .1 1.5.3" />
                    <path d="M8 5v6" />
                    <path d="M6 7h4" />
                  </g>
                  <text x="520" y="330" textAnchor="middle" fill="var(--foreground)" fontSize="11" fontWeight="700">
                    Dual Ledger
                  </text>
                  <text x="520" y="345" textAnchor="middle" fill="var(--muted-foreground)" fontSize="9">
                    Mill vs Home Debit
                  </text>
                </g>

                {/* ============================================================== */}
                {/* NODE 4: EXECUTIVE ANALYTICS (x: 680, y: 190) */}
                {/* ============================================================== */}
                <g
                  onClick={() => {
                    setIsSimulating(false);
                    setActiveStage(4);
                  }}
                  onMouseEnter={() => setHoveredNode(4)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer transition-transform duration-200 hover:scale-105"
                >
                  <circle
                    cx="680"
                    cy="190"
                    r={activeStage === 4 ? "46" : "38"}
                    fill="url(#glowNodeGrad)"
                    stroke={activeStage === 4 ? "var(--primary)" : "var(--border)"}
                    strokeWidth={activeStage === 4 ? "3" : "1.5"}
                    filter={activeStage === 4 ? "url(#softGlow)" : undefined}
                    className="transition-all duration-300"
                  />
                  <circle cx="680" cy="190" r="28" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                  {/* Bar Chart Icon */}
                  <g transform="translate(668, 178)" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </g>
                  <text x="680" y="250" textAnchor="middle" fill="var(--foreground)" fontSize="11" fontWeight="700">
                    Analytics
                  </text>
                  <text x="680" y="265" textAnchor="middle" fill="var(--muted-foreground)" fontSize="9">
                    Profit & Excel
                  </text>
                </g>
              </svg>
            </div>

            {/* Quick interactive indicator bar */}
            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                Live Node: <strong className="text-foreground">{currentStage.badge}</strong>
              </span>
              <span>Tap any node above to inspect details</span>
            </div>
          </div>

          {/* Right: Stage Deep-Dive Inspector Card (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-[var(--card-shadow)] relative space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="accent" className="font-semibold text-xs">
                  {currentStage.badge}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground font-medium">
                  Phase {activeStage + 1} of 5
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  {currentStage.title}
                </h3>
                <p className="text-sm font-medium text-primary mt-0.5">
                  {currentStage.subtitle}
                </p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentStage.description}
              </p>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {currentStage.metrics.map((m, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg border border-border/70 bg-secondary/40 text-center space-y-0.5"
                  >
                    <div className="text-[10px] text-muted-foreground truncate uppercase tracking-wider">
                      {m.label}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-foreground font-mono">
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Automations at this stage:
                </div>
                <div className="space-y-1.5">
                  {currentStage.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action inside Inspector */}
            <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsSimulating(false);
                  setActiveStage((prev) => (prev > 0 ? prev - 1 : STAGES.length - 1));
                }}
                className="text-xs"
              >
                Previous
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsSimulating(false);
                  setActiveStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : 0));
                }}
                className="text-xs gap-1.5"
              >
                Next Stage
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
