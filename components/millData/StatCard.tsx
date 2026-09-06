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
    headerBg: "bg-violet-500/[0.06] dark:bg-violet-500/10 border-violet-500/20",
    iconBg: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/25 shadow-2xs",
    title: "text-foreground dark:text-violet-100",
    value: "text-violet-700 dark:text-violet-400",
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
    <div className="rounded-xl border border-border/80 dark:border-border/60 bg-card text-card-foreground shadow-xs overflow-hidden transition-all duration-200 hover:border-border hover:shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div
        className={cn(
          "px-4 py-3 sm:px-5 sm:py-3.5 border-b flex items-center justify-between min-h-[56px] gap-3",
          headerClassName || styles.headerBg
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border",
              styles.iconBg
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <h3
            className={cn(
              "font-semibold text-sm sm:text-base tracking-tight truncate",
              titleClassName || styles.title
            )}
          >
            {label}
          </h3>
        </div>

        <div
          className={cn(
            "text-lg sm:text-xl font-bold font-mono tabular-nums flex items-baseline gap-1 shrink-0 tracking-tight",
            headerValueClassName || styles.value
          )}
        >
          {isLoading ? (
            <Skeleton className="h-6 w-24 rounded-md" />
          ) : (
            <>
              <span className="text-xs sm:text-sm font-sans font-medium opacity-65">₹</span>
              <span>{isSensitive ? "••••••" : displayHeader}</span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4">
        {isLoading ? (
          <div className={gridClassName}>
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <Skeleton key={i} className="h-[64px] w-full rounded-lg" />
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
