"use client";

import React from "react";
import { Star, CheckCircle2, Quote, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TESTIMONIALS = [
  {
    name: "Ramesh Patel",
    role: "Proprietor, Patel Flour & Spice Mills",
    location: "Sardarshahar, Rajasthan",
    stats: "3,500 kg Wheat Daily",
    quote:
      "Before Mill Diary, daily khata was maintained on torn paper chits that would go missing by evening. Now, my operator logs each slip in Hindi or takes a quick photo. At closing, cash in drawer matches the app 100%.",
  },
  {
    name: "Suresh Verma",
    role: "General Manager, Shrinathji Oil Expeller",
    location: "Dewas, Madhya Pradesh",
    stats: "1,800 kg Mustard Daily",
    quote:
      "The automatic oil yield deduction and khalli (oilcake) calculation saved us over ₹35,000 in unbilled credits every month. It’s so simple that our mill workers learned it on day one.",
  },
  {
    name: "Anil Sharma",
    role: "Owner, Sharma Kisan Grinding Center",
    location: "Meerut, Uttar Pradesh",
    stats: "2,200 kg Multi-Crop Daily",
    quote:
      "Separating mill diesel and power bills from my household grocery drawing was an eye-opener. Mill Diary showed me my exact net profit for the first time in 12 years of business.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="accent" className="gap-1.5 px-3.5 py-1 text-xs font-semibold">
            <Users className="h-3.5 w-3.5 text-primary" />
            Verified Mill Operator Reviews
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Trusted by Mill Owners <br className="hidden sm:inline" />
            <span className="text-primary">Across Grain-Growing Regions</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Hear from millers who transitioned from paper registers to Mill Diary&apos;s digital ledger system.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-[var(--card-shadow)] hover:shadow-[var(--card-hover-shadow)] transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Stars & Stat badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/60">
                    {t.stats}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Strip */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">{t.name}</h4>
                  <p className="text-xs text-primary font-medium">{t.role}</p>
                  <p className="text-[11px] text-muted-foreground">{t.location}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
