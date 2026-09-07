"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditMillDataSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-9 sm:h-10 w-44 rounded-xl" />
        <Skeleton className="h-9 sm:h-10 w-32 rounded-xl" />
      </div>

      <Card className="rounded-2xl border border-border/80 dark:border-white/10 shadow-[var(--card-shadow)] overflow-hidden">
        <CardContent className="space-y-8 pt-6 pb-6 px-4 sm:px-6">
          {/* Credits Section */}
          <SectionSkeleton />

          {/* Debits Section */}
          <SectionSkeleton />

          {/* Summary Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputSkeleton />
              <InputSkeleton />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-5 border-t border-border/70">
            <Skeleton className="h-10 w-24 rounded-xl" />
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Section Skeleton ---------------- */

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <Skeleton className="h-5 w-28 rounded-md" />
        <Skeleton className="h-4 w-32 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputSkeleton />
        <InputSkeleton />
        <InputSkeleton />
        <InputSkeleton />

        {/* Textarea */}
        <div className="md:col-span-2 space-y-1.5">
          <Skeleton className="h-3.5 w-32 rounded-md" />
          <Skeleton className="h-18 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Input Skeleton ---------------- */

function InputSkeleton() {
  return (
    <div className="space-y-1.5">
      <Skeleton className="h-3.5 w-24 rounded-md" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}
