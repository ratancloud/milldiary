"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ReadOnlyProps {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}

export function ReadOnly({
  label,
  value,
  hint,
  className,
}: ReadOnlyProps) {
  const displayValue = value.startsWith("₹") ? value : `₹ ${value}`;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          {label}
        </label>
        {hint && (
          <span className="text-[11px] text-muted-foreground font-medium">
            {hint}
          </span>
        )}
      </div>

      <div className="flex items-center rounded-lg border border-input bg-muted/40 dark:bg-white/[0.03] px-3 h-10 select-none shadow-2xs">
        <span className="text-sm font-bold font-mono tabular-nums text-foreground tracking-tight">
          {displayValue}
        </span>
      </div>
    </div>
  );
}