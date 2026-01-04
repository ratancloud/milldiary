import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const DashboardChartsSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 1. Overview Chart Skeleton */}
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-48" /> {/* Title */}
          <Skeleton className="h-4 w-72" /> {/* Description */}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-75 sm:h-100 w-full rounded-md" />
        </CardContent>
      </Card>

      {/* 2. Tabs Section Skeleton */}
      <div className="space-y-4">
        {/* Tabs Header Mimic */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Skeleton className="h-7 w-40" /> {/* "Detailed Breakdown" text */}
          <Skeleton className="h-10 w-full sm:w-48 rounded-md" /> {/* Tabs Trigger */}
        </div>

        {/* Tab Content Chart */}
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-75 sm:h-87.5 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>

      {/* 3. Home Debit Skeleton */}
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-75 sm:h-100 w-full rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
};