import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

interface StatCardProp {
  icon: LucideIcon;
  label: string;
  headerValue: string;
  isLoading?: boolean;
  isSensitive?: boolean;
  headerClassName?: string;
  titleClassName?: string;
  headerValueClassName?: string;
  children: React.ReactNode;
}

const StatCard = ({
  icon: Icon,
  label,
  headerValue,
  isLoading = false,
  isSensitive = false,
  headerClassName = "bg-green-50/40 dark:bg-green-900/10",
  titleClassName = "text-green-600 dark:text-green-400",
  headerValueClassName = "text-green-700 dark:text-green-400",
  children,
}: StatCardProp) => {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden transition-all duration-200 hover:scale-102">
      {/* Header */}
      <div
        className={`p-4 border-b flex items-center justify-between ${headerClassName}`}
      >
        <h3
          className={`font-bold text-base flex items-center gap-2 ${titleClassName}`}
        >
          <Icon className="h-4 w-4" /> {label}
        </h3>
        <div
          className={`text-xl font-bold tabular-nums ${headerValueClassName}`}
        >
          {isLoading ? (
            <Skeleton className="h-7 w-28 opacity-50" />
          ) : (
            `₹${isSensitive ? "••••••" : headerValue}`
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">{children}</div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
