import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatCardVariant =
  | "default"
  | "green"
  | "red"
  | "blue"
  | "purple"
  | "amber"
  | "muted";

const CARD_VARIANTS: Record<
  StatCardVariant,
  { headerBg: string; iconBg: string; title: string; value: string }
> = {
  default: {
    headerBg: "bg-muted/35 dark:bg-muted/15 border-border/60",
    iconBg: "bg-background dark:bg-muted/60 text-muted-foreground border-border/60 shadow-2xs",
    title: "text-foreground",
    value: "text-foreground",
  },
  green: {
    headerBg: "bg-emerald-500/[0.06] dark:bg-emerald-500/10 border-emerald-500/20",
    iconBg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25 shadow-2xs",
    title: "text-foreground dark:text-emerald-100",
    value: "text-emerald-700 dark:text-emerald-400",
  },
  red: {
    headerBg: "bg-rose-500/[0.06] dark:bg-rose-500/10 border-rose-500/20",
    iconBg: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/25 shadow-2xs",
    title: "text-foreground dark:text-rose-100",
    value: "text-rose-700 dark:text-rose-400",
  },
  blue: {
    headerBg: "bg-sky-500/[0.06] dark:bg-sky-500/10 border-sky-500/20",
    iconBg: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/25 shadow-2xs",
    title: "text-foreground dark:text-sky-100",
    value: "text-sky-700 dark:text-sky-400",
  },
  purple: {
    headerBg: "bg-primary/[0.08] dark:bg-primary/15 border-primary/20",
    iconBg: "bg-primary/15 text-primary dark:text-primary border-primary/25 shadow-2xs",
    title: "text-foreground dark:text-foreground",
    value: "text-primary dark:text-primary",
  },
  amber: {
    headerBg: "bg-amber-500/[0.06] dark:bg-amber-500/10 border-amber-500/20",
    iconBg: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25 shadow-2xs",
    title: "text-foreground dark:text-amber-100",
    value: "text-amber-700 dark:text-amber-400",
  },
  muted: {
    headerBg: "bg-muted/35 dark:bg-muted/15 border-border/60",
    iconBg: "bg-background dark:bg-muted/60 text-muted-foreground border-border/60 shadow-2xs",
    title: "text-foreground",
    value: "text-foreground",
  },
};

export interface StatCardProps {
  icon: LucideIcon;
  label: string | React.ReactNode;
  headerValue: string | number;
  variant?: StatCardVariant;
  isLoading?: boolean;
  isSensitive?: boolean;
  headerClassName?: string;
  titleClassName?: string;
  headerValueClassName?: string;
  gridClassName?: string;
  skeletonCount?: number;
  children: React.ReactNode;
}

const StatCard = ({
  icon: Icon,
  label,
  headerValue,
  variant = "default",
  isLoading = false,
  isSensitive = false,
  headerClassName,
  titleClassName,
  headerValueClassName,
  gridClassName = "grid grid-cols-2 gap-2.5 sm:gap-3",
  skeletonCount = 4,
  children,
}: StatCardProps) => {
  const styles = CARD_VARIANTS[variant] ?? CARD_VARIANTS.default;
  const hasCurrencyPrefix =
    typeof headerValue === "string" &&
    (headerValue.startsWith("₹") || headerValue.startsWith("Rs"));
  const rawDisplay =
    typeof headerValue === "number"
      ? headerValue.toLocaleString("en-IN")
      : hasCurrencyPrefix
        ? headerValue.replace(/^(₹|Rs\.?)\s*/, "")
        : headerValue;
  const displayHeader = rawDisplay;

  return (
    <div className="rounded-2xl border border-border/70 bg-card/90 backdrop-blur-md text-card-foreground shadow-[var(--card-shadow)] hover:shadow-[var(--card-hover-shadow)] hover:border-border/90 overflow-hidden transition-all duration-200 flex flex-col justify-between group">
      {/* Header */}
      <div
        className={cn(
          "px-4 py-3.5 sm:px-5 sm:py-4 border-b flex items-center justify-between min-h-[60px] gap-3",
          headerClassName || styles.headerBg
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105",
              styles.iconBg
            )}
          >
            <Icon className="h-4.5 w-4.5" />
          </div>
          <h3
            className={cn(
              "font-bold text-sm sm:text-base tracking-tight truncate",
              titleClassName || styles.title
            )}
          >
            {label}
          </h3>
        </div>

        <div
          className={cn(
            "text-xl sm:text-2xl font-black font-mono tabular-nums flex items-baseline gap-1 shrink-0 tracking-tight",
            headerValueClassName || styles.value
          )}
        >
          {isLoading ? (
            <Skeleton className="h-7 w-24 rounded-lg" />
          ) : (
            <>
              <span className="text-xs sm:text-sm font-sans font-medium opacity-65">₹</span>
              <span>{isSensitive ? "••••••" : displayHeader}</span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {isLoading ? (
          <div className={gridClassName}>
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <Skeleton key={i} className="h-[68px] w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className={gridClassName}>{children}</div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
