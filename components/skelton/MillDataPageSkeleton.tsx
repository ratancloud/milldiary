import React from "react";
import { Skeleton } from "../ui/skeleton";

const MillDataPageSkeleton = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* ================= Header ================= */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-25 rounded-md shadow-sm" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded-md shadow-sm" />
          <Skeleton className="h-9 w-10 rounded-md shadow-sm" />
        </div>
      </div>

      {/* ================= Summary Cards ================= */}
      <div className="grid grid-cols-2 gap-4 lg:gap-6">
        <Skeleton className="h-28 rounded-xl border shadow-sm" />
        <Skeleton className="h-28 rounded-xl border shadow-sm" />
      </div>

      {/* ================= Stat Cards ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Credit Card */}
        <div className="border shadow-sm bg-card rounded-xl p-4 space-y-4">
          <div className="p-4 border-b space-y-3 flex justify-between">
            <Skeleton className="h-6 w-30" />
            <Skeleton className="h-6 w-15" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-16 rounded-md" />
            <Skeleton className="h-16 rounded-md" />
            <Skeleton className="h-16 rounded-md" />
            <Skeleton className="h-16 rounded-md" />
          </div>
        </div>

        {/* Debit Card */}
        <div className="border shadow-sm bg-card rounded-xl  p-4 space-y-4">
          <div className="p-4 border-b space-y-3 flex justify-between">
            <Skeleton className="h-6 w-30" />
            <Skeleton className="h-6 w-15" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-16 rounded-md" />
            <Skeleton className="h-16 rounded-md" />
            <Skeleton className="h-16 rounded-md" />
            <Skeleton className="h-16 rounded-md" />
          </div>
        </div>
      </div>

      {/* ================= Table Card ================= */}
      <div className="rounded-xl border shadow-sm bg-card">
        {/* Table Header */}
        <div className="p-4 border-b gap-2 flex flex-col sm:flex-row justify-between items-center">
          <Skeleton className="h-10 w-full lg:w-96" />
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>

        {/* Table Rows */}
        <div className="p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-md" />
          ))}
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t">
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </div>
  );
};

export default MillDataPageSkeleton;
