"use client";

import React, { useState } from "react";
import { GrindingLedgerStat } from "@/types/grinding-ledger";
import { formatKg } from "@/lib/helper";
import { Scale, Users, Award, MapPin, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface GrindingLedgerStatsProps {
  stats: GrindingLedgerStat;
  isLoading?: boolean;
}

const GrindingLedgerStats: React.FC<GrindingLedgerStatsProps> = ({
  stats,
  isLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="space-y-1.5 min-w-0">
            <Skeleton className="h-4 sm:h-5 w-32 sm:w-36 rounded-md" />
            <Skeleton className="h-3 sm:h-3.5 w-44 sm:w-56 rounded-md" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <Skeleton className="h-2.5 w-14 rounded-md" />
          <Skeleton className="h-4 sm:h-5 w-20 sm:w-24 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden transition-all">
      {/* Compact Dropdown Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-primary/15 text-primary shrink-0">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
              Daily Statistics
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground truncate mt-0.5 font-medium">
              <span>Wheat: {formatKg(stats.wheatWeight)} kg</span>
              <span>·</span>
              <span>Mustard: {formatKg(stats.mustardWeight)} kg</span>
              <span>·</span>
              <span className="font-bold text-foreground">{stats.totalRecords} slips</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Total Ground</span>
            <span className="text-sm font-black text-primary tabular-nums">
              {formatKg(stats.totalWeight)} Kg
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-muted/50 text-muted-foreground hover:text-foreground pointer-events-none"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Expanded Stat Cards */}
      {isExpanded && (
        <div className="p-4 border-t border-border/60 bg-muted/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in-0 duration-200">
          {/* Total Weight Card */}
          <div className="rounded-xl border bg-card shadow-xs overflow-hidden border-primary/20 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-primary flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5" /> Total Weight
              </h4>
              <span className="text-base font-extrabold tabular-nums text-primary">
                {formatKg(stats.totalWeight)} Kg
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1 border-t border-border/50">
              <div className="flex justify-between font-medium">
                <span className="text-muted-foreground">Wheat:</span>
                <span className="font-bold text-foreground">{formatKg(stats.wheatWeight)} kg</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-muted-foreground">Mustard:</span>
                <span className="font-bold text-foreground">{formatKg(stats.mustardWeight)} kg</span>
              </div>
            </div>
          </div>

          {/* Customer Entries Card */}
          <div className="rounded-xl border bg-card shadow-xs overflow-hidden border-primary/20 p-3.5 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-primary flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Total Slips
              </h4>
              <span className="text-base font-extrabold tabular-nums text-primary">
                {stats.totalRecords}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground font-medium pt-1 border-t border-border/50 flex justify-between">
              <span>Active in view</span>
              <span className="font-bold text-primary">Day Ledger</span>
            </div>
          </div>

          {/* Average Weight Card */}
          <div className="rounded-xl border bg-card shadow-xs overflow-hidden border-primary/20 p-3.5 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-primary flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" /> Avg / Slip
              </h4>
              <span className="text-base font-extrabold tabular-nums text-primary">
                {formatKg(stats.averageWeight || 0)} Kg
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground font-medium pt-1 border-t border-border/50 flex justify-between">
              <span>Average batch</span>
              <span className="font-bold text-primary">Per Customer</span>
            </div>
          </div>

          {/* Top Village Card */}
          <div className="rounded-xl border bg-card shadow-xs overflow-hidden border-primary/20 p-3.5 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-primary flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Top Village
              </h4>
              <span className="text-base font-extrabold text-primary truncate max-w-[110px]">
                {stats.topVillage}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground font-medium pt-1 border-t border-border/50 flex justify-between">
              <span>Most frequent</span>
              <span className="font-bold text-primary">Regional</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrindingLedgerStats;
