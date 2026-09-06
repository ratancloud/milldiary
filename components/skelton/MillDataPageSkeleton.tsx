import React from "react";
import { Skeleton } from "../ui/skeleton";
import SummaryCards from "../millData/SummaryCards";

const MillDataPageSkeleton = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* ================= Header ================= */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32 rounded-md" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      {/* ================= Summary Cards (4-Grid) ================= */}
      <SummaryCards
        income={0}
        saving={0}
        isLoading={true}
      />

      {/* ================= Table Card ================= */}
      <div className="rounded-xl border border-border shadow-sm bg-card flex flex-col">
        {/* Table Header */}
        <div className="p-4 border-b bg-muted/10 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          <Skeleton className="h-10 w-full lg:max-w-md rounded-md" />
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </div>

        {/* Table Rows */}
        <div className="p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full rounded-md" />
          ))}
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t bg-muted/10 flex items-center justify-between">
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
    </div>
  );
};

export default MillDataPageSkeleton;
