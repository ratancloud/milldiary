import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SummaryCards from "@/components/millData/SummaryCards";
import { DashboardChartsSkeleton } from "./DashboardChartsSkeleton";

export const DashboardPageSkeleton = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* ---------- Header ---------- */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32 rounded-md" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      {/* ---------- Summary Cards Skeleton ---------- */}
      <SummaryCards
        income={0}
        saving={0}
        isLoading={true}
      />

      {/* ---------- Charts Skeleton ---------- */}
      <DashboardChartsSkeleton />
    </div>
  );
};

export default DashboardPageSkeleton;
