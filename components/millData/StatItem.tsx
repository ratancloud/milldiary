import React from "react";
import { formatKg, formatRs } from "@/lib/helper";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatItemVariant =
  | "green"
  | "red"
  | "blue"
  | "purple"
  | "amber"
  | "muted";

const ITEM_VARIANTS: Record<
  StatItemVariant,
  { bg: string; label: string; color: string }
> = {
  green: {
    bg: "bg-green-50/40 dark:bg-green-900/10",
    label: "text-green-700 dark:text-green-400",
    color: "text-green-600 dark:text-green-400",
  },
  red: {
    bg: "bg-red-50/40 dark:bg-red-900/10",
    label: "text-red-700 dark:text-red-400",
    color: "text-red-600 dark:text-red-400",
  },
  blue: {
    bg: "bg-blue-50/40 dark:bg-blue-900/10",
    label: "text-blue-700 dark:text-blue-400",
    color: "text-blue-700 dark:text-blue-300",
  },
  purple: {
    bg: "bg-purple-50/40 dark:bg-purple-900/10",
    label: "text-purple-700 dark:text-purple-400",
    color: "text-purple-700 dark:text-purple-300",
  },
  amber: {
    bg: "bg-amber-50/40 dark:bg-amber-900/10",
    label: "text-amber-700 dark:text-amber-400",
    color: "text-amber-700 dark:text-amber-400",
  },
  muted: {
    bg: "bg-muted/30",
    label: "text-muted-foreground",
    color: "text-foreground",
  },
};

export interface StatItemProps {
  label: string;
  value: number | string;
  sub?: number | string;
  badge?: React.ReactNode;
  icon?: LucideIcon;
  variant?: StatItemVariant;
  colorClass?: string;
  statItemBgClass?: string;
  isSensitive?: boolean;
}

const StatItem = ({
  label,
  value,
  sub,
  badge,
  icon: Icon,
  variant = "muted",
  colorClass,
  statItemBgClass,
  isSensitive = false,
}: StatItemProps) => {
  const styles = ITEM_VARIANTS[variant] ?? ITEM_VARIANTS.muted;
  const bg = statItemBgClass || styles.bg;
  const valColor = colorClass || styles.color;
  const labelColor = styles.label;

  const displayValue = typeof value === "number" ? formatRs(value) : value;
  const displaySub = typeof sub === "number" ? `${formatKg(sub)} Kg` : sub;

  return (
    <div
      className={cn(
        "flex flex-col justify-between space-y-1.5 p-3 rounded-lg border border-border/60 transition-transform hover:scale-[1.02]",
        bg
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wider",
            labelColor
          )}
        >
          {label}
        </span>
        {badge && (
          <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
            {badge}
          </span>
        )}
        {Icon && <Icon className={cn("h-3.5 w-3.5", valColor)} />}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className={cn("text-lg sm:text-xl font-bold tabular-nums", valColor)}>
          ₹{isSensitive ? "•••••" : displayValue}
        </span>
        {displaySub && (
          <span className="text-sm font-semibold text-muted-foreground tabular-nums">
            {displaySub}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatItem;
