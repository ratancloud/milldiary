import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  isLoading?: boolean;
  isSensitive?: boolean;
  variant?: "green" | "blue" | "red" | "purple";
}

const StatCard2 = ({
  label,
  value,
  icon: Icon,
  isLoading = false,
  isSensitive = false,
  variant = "green",
}: SummaryCardProps) => {
  const variants = {
    green: {
      card: "bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/10 border-green-200 dark:border-green-900",
      title: "text-green-700 dark:text-green-400",
      icon: "text-green-600 dark:text-green-400",
      value: "text-green-700 dark:text-green-300",
    },
    blue: {
      card: "bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/10 border-blue-200 dark:border-blue-900",
      title: "text-blue-700 dark:text-blue-400",
      icon: "text-blue-600 dark:text-blue-400",
      value: "text-blue-700 dark:text-blue-300",
    },
    red: {
      card: "bg-linear-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/10 border-red-200 dark:border-red-900",
      title: "text-red-700 dark:text-red-400",
      icon: "text-red-600 dark:text-red-400",
      value: "text-red-700 dark:text-red-300",
    },
    purple: {
      card: "bg-linear-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/10 border-violet-200 dark:border-violet-900",
      title: "text-violet-700 dark:text-violet-400",
      icon: "text-violet-600 dark:text-violet-400",
      value: "text-violet-700 dark:text-violet-300",
    },
  };

  const style = variants[variant];

  return (
    <Card
      className={cn(
        "transition-all duration-200 shadow-xs hover:scale-102",
        style.card
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle
          className={cn("text-sm sm:text-base font-bold", style.title)}
        >
          {label}
        </CardTitle>
        <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", style.icon)} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-28 opacity-50" />
        ) : (
          <div
            className={cn(
              "text-xl sm:text-2xl font-bold tabular-nums",
              style.value
            )}
          >
            ₹{isSensitive ? "••••••" : value}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard2;
