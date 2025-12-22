import { formatKg, formatRs } from "@/lib/helper";
import React from "react";

const StatItem = ({
  label,
  value,
  sub,
  colorClass = "text-foreground",
  statItemBgClass= "bg-muted/30",
  isSensitive = false,
}: {
  label: string;
  value: number;
  sub?: number;
  statItemBgClass?: string;
  colorClass?: string;
  isSensitive?: boolean;
  isLoading?: boolean
}) => (
  <div className={`flex flex-col space-y-1 p-3 rounded-lg ${statItemBgClass} border border-border/60 transition-transform hover:scale-105`}>
    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
      {label}
    </span>
    <div className="flex items-baseline gap-2">
      <span className={`text-lg font-bold tabular-nums ${colorClass}`}>
        ₹{isSensitive ? "•••••" : formatRs(value)}
      </span>
      {sub && (
        <span className="text-sm text-muted-foreground tabular-nums">
          {formatKg(sub)}kg
        </span>
      )}
    </div>
  </div>
);

export default StatItem;
