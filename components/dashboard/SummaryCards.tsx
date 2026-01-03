import React from "react";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type CardColor = "blue" | "green" | "red" | "purple" | "orange" | "indigo";

interface SummaryCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  isLoading?: boolean;
  isSensitive?: boolean;
  color?: CardColor;
}

export const SummaryCards = ({
  label,
  value,
  icon: Icon,
  isLoading = false,
  isSensitive = false,
  color = "blue",
}: SummaryCardProps) => {
  
  const themes = {
    blue: {
      wrapper: "bg-blue-50/60 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800",
      iconBox: "bg-blue-100 dark:bg-blue-900/40",
      icon: "text-blue-600 dark:text-blue-400",
    },
    green: {
      wrapper: "bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800",
      iconBox: "bg-emerald-100 dark:bg-emerald-900/40",
      icon: "text-emerald-600 dark:text-emerald-400",
    },
    red: {
      wrapper: "bg-rose-50/60 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800",
      iconBox: "bg-rose-100 dark:bg-rose-900/40",
      icon: "text-rose-600 dark:text-rose-400",
    },
    purple: {
      wrapper: "bg-purple-50/60 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800",
      iconBox: "bg-purple-100 dark:bg-purple-900/40",
      icon: "text-purple-600 dark:text-purple-400",
    },
    orange: {
      wrapper: "bg-orange-50/60 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800",
      iconBox: "bg-orange-100 dark:bg-orange-900/40",
      icon: "text-orange-600 dark:text-orange-400",
    },
    indigo: {
      wrapper: "bg-indigo-50/60 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-800",
      iconBox: "bg-indigo-100 dark:bg-indigo-900/40",
      icon: "text-indigo-600 dark:text-indigo-400",
    },
  };

  const theme = themes[color];

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border rounded-md transition-all hover:shadow-sm",
        theme.wrapper
      )}
    >
      <div className="space-y-1">
        <p className="text-base font-medium text-muted-foreground/80">{label}</p>
        
        {isLoading ? (
          <Skeleton className="h-7 w-24 bg-foreground/10" />
        ) : (
          <p className="text-2xl leading-tight font-bold tracking-tight">
             ₹{isSensitive ? "••••••" : value}
          </p>
        )}
      </div>

      <div className={cn("p-3 rounded-full flex items-center justify-center", theme.iconBox)}>
        <Icon className={cn("size-5", theme.icon)} />
      </div>
    </div>
  );
};