import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatCardVariant = "green" | "red" | "blue" | "purple" | "amber";

const CARD_VARIANTS: Record<
  StatCardVariant,
  { headerBg: string; title: string; value: string }
> = {
  green: {
    headerBg: "bg-green-50/40 dark:bg-green-900/10",
    title: "text-green-600 dark:text-green-400",
    value: "text-green-700 dark:text-green-400",
  },
  red: {
    headerBg: "bg-red-50/40 dark:bg-red-900/10",
    title: "text-red-600 dark:text-red-400",
    value: "text-red-700 dark:text-red-400",
  },
  blue: {
    headerBg: "bg-blue-50/40 dark:bg-blue-900/10",
    title: "text-blue-700 dark:text-blue-400",
    value: "text-blue-700 dark:text-blue-400",
  },
  purple: {
    headerBg: "bg-purple-50/40 dark:bg-purple-900/10",
    title: "text-purple-700 dark:text-purple-400",
    value: "text-purple-700 dark:text-purple-400",
  },
  amber: {
    headerBg: "bg-amber-50/40 dark:bg-amber-900/10",
    title: "text-amber-700 dark:text-amber-400",
    value: "text-amber-700 dark:text-amber-400",
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
  variant = "green",
  isLoading = false,
  isSensitive = false,
  headerClassName,
  titleClassName,
  headerValueClassName,
  gridClassName = "grid grid-cols-2 gap-3",
  skeletonCount = 4,
  children,
}: StatCardProps) => {
  const styles = CARD_VARIANTS[variant] ?? CARD_VARIANTS.green;
  const displayHeader =
    typeof headerValue === "number" ? headerValue.toLocaleString("en-IN") : headerValue;

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden transition-all duration-200 hover:scale-[1.01] flex flex-col justify-between">
      {/* Header */}
      <div
        className={cn(
          "p-4 border-b flex items-center justify-between min-h-[65px] gap-3",
          headerClassName || styles.headerBg
        )}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className={cn(
              "font-bold text-base flex items-center gap-2",
              titleClassName || styles.title
            )}
          >
            <Icon className="h-4 w-4 shrink-0" /> {label}
          </h3>
        </div>

        <div
          className={cn(
            "text-xl sm:text-2xl font-bold tabular-nums flex items-baseline gap-1.5 shrink-0",
            headerValueClassName || styles.value
          )}
        >
          {isLoading ? (
            <Skeleton className="h-7 w-28 opacity-50" />
          ) : (
            `₹${isSensitive ? "••••••" : displayHeader}`
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className={gridClassName}>
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
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
