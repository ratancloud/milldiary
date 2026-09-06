import React from "react";
import { formatKg, formatRs } from "@/lib/helper";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatItemVariant =
  | "default"
  | "green"
  | "red"
  | "blue"
  | "purple"
  | "amber"
  | "muted";

const ITEM_VARIANTS: Record<
  StatItemVariant,
  { bg: string; label: string; color: string; currency: string; badge: string; icon: string }
> = {
  default: {
    bg: "bg-muted/20 hover:bg-muted/35 dark:bg-muted/10 dark:hover:bg-muted/20 border-border/60",
    label: "text-muted-foreground",
    color: "text-foreground",
    currency: "text-muted-foreground/70",
    badge: "bg-background text-muted-foreground border-border/60",
    icon: "text-muted-foreground/70 group-hover:text-foreground",
  },
  green: {
    bg: "bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08] dark:bg-emerald-500/[0.06] dark:hover:bg-emerald-500/[0.12] border-emerald-500/15 dark:border-emerald-500/25",
    label: "text-emerald-700/80 dark:text-emerald-300/80",
    color: "text-foreground dark:text-emerald-50",
    currency: "text-emerald-600/70 dark:text-emerald-400/70",
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    icon: "text-emerald-600/70 group-hover:text-emerald-700 dark:text-emerald-400/80 dark:group-hover:text-emerald-300",
  },
  red: {
    bg: "bg-rose-500/[0.04] hover:bg-rose-500/[0.08] dark:bg-rose-500/[0.06] dark:hover:bg-rose-500/[0.12] border-rose-500/15 dark:border-rose-500/25",
    label: "text-rose-700/80 dark:text-rose-300/80",
    color: "text-foreground dark:text-rose-50",
    currency: "text-rose-600/70 dark:text-rose-400/70",
    badge: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
    icon: "text-rose-600/70 group-hover:text-rose-700 dark:text-rose-400/80 dark:group-hover:text-rose-300",
  },
  blue: {
    bg: "bg-sky-500/[0.04] hover:bg-sky-500/[0.08] dark:bg-sky-500/[0.06] dark:hover:bg-sky-500/[0.12] border-sky-500/15 dark:border-sky-500/25",
    label: "text-sky-700/80 dark:text-sky-300/80",
    color: "text-foreground dark:text-sky-50",
    currency: "text-sky-600/70 dark:text-sky-400/70",
    badge: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
    icon: "text-sky-600/70 group-hover:text-sky-700 dark:text-sky-400/80 dark:group-hover:text-sky-300",
  },
  purple: {
    bg: "bg-violet-500/[0.04] hover:bg-violet-500/[0.08] dark:bg-violet-500/[0.06] dark:hover:bg-violet-500/[0.12] border-violet-500/15 dark:border-violet-500/25",
    label: "text-violet-700/80 dark:text-violet-300/80",
    color: "text-foreground dark:text-violet-50",
    currency: "text-violet-600/70 dark:text-violet-400/70",
    badge: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20",
    icon: "text-violet-600/70 group-hover:text-violet-700 dark:text-violet-400/80 dark:group-hover:text-violet-300",
  },
  amber: {
    bg: "bg-amber-500/[0.04] hover:bg-amber-500/[0.08] dark:bg-amber-500/[0.06] dark:hover:bg-amber-500/[0.12] border-amber-500/15 dark:border-amber-500/25",
    label: "text-amber-700/80 dark:text-amber-300/80",
    color: "text-foreground dark:text-amber-50",
    currency: "text-amber-600/70 dark:text-amber-400/70",
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    icon: "text-amber-600/70 group-hover:text-amber-700 dark:text-amber-400/80 dark:group-hover:text-amber-300",
  },
  muted: {
    bg: "bg-muted/20 hover:bg-muted/35 dark:bg-muted/10 dark:hover:bg-muted/20 border-border/60",
    label: "text-muted-foreground",
    color: "text-foreground",
    currency: "text-muted-foreground/70",
    badge: "bg-background text-muted-foreground border-border/60",
    icon: "text-muted-foreground/70 group-hover:text-foreground",
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
  variant = "default",
  colorClass,
  statItemBgClass,
  isSensitive = false,
}: StatItemProps) => {
  const styles = ITEM_VARIANTS[variant] ?? ITEM_VARIANTS.default;
  const bg = statItemBgClass || styles.bg;
  const valColor = colorClass || styles.color;
  const labelColor = styles.label;

  const hasCurrencyPrefix =
    typeof value === "string" && (value.startsWith("₹") || value.startsWith("Rs"));
  const displayValue =
    typeof value === "number"
      ? formatRs(value)
      : hasCurrencyPrefix
        ? value.replace(/^(₹|Rs\.?)\s*/, "")
        : value;
  const displaySub = typeof sub === "number" ? `${formatKg(sub)} Kg` : sub;

  return (
    <div
      className={cn(
        "group flex flex-col justify-between p-2.5 sm:p-3 rounded-lg border transition-all duration-150 min-h-[64px]",
        bg
      )}
    >
      {/* Top row: Label + Badge/Icon */}
      <div className="flex items-center justify-between gap-1.5 min-w-0">
        <span
          className={cn(
            "text-[11px] sm:text-xs font-semibold uppercase tracking-wider truncate",
            labelColor
          )}
        >
          {label}
        </span>
        {badge && (
          <span
            className={cn(
              "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium font-mono border tabular-nums shrink-0",
              styles.badge
            )}
          >
            {badge}
          </span>
        )}
        {Icon && (
          <Icon
            className={cn(
              "h-3.5 w-3.5 shrink-0 transition-opacity",
              styles.icon
            )}
          />
        )}
      </div>

      {/* Bottom row: Value (Amount) + Sub (Weight) */}
      <div className="flex items-baseline justify-between gap-1.5 mt-1 min-w-0">
        <div className="flex items-baseline gap-0.5 min-w-0">
          <span
            className={cn(
              "text-xs sm:text-sm font-sans font-medium shrink-0",
              styles.currency
            )}
          >
            ₹
          </span>
          <span
            className={cn(
              "text-base sm:text-lg font-bold font-mono tabular-nums tracking-tight truncate",
              valColor
            )}
          >
            {isSensitive ? "•••••" : displayValue}
          </span>
        </div>

        {displaySub && (
          <span className="text-[11px] sm:text-xs font-medium font-mono text-muted-foreground tabular-nums shrink-0 whitespace-nowrap">
            {displaySub}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatItem;
