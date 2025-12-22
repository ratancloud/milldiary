"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditMillDataSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-30 rounded-md" />
        <Skeleton className="h-9 w-25 rounded-md" />
      </div>

      <Card>
        <CardContent className="space-y-8">
          {/* Credits Section */}
          <SectionSkeleton />

          {/* Debits Section */}
          <SectionSkeleton />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
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
      <Skeleton className="h-6 w-28" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputSkeleton />
        <InputSkeleton />
        <InputSkeleton />
        <InputSkeleton />

        {/* Textarea */}
        <div className="md:col-span-2 space-y-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Input Skeleton ---------------- */

function InputSkeleton() {
  return (
    <div className="space-y-1">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}
