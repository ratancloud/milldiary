"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  CalendarIcon,
  Eye,
  EyeOff,
} from "lucide-react";

import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import SummaryCards from "@/components/millData/SummaryCards";
import { DashboardChartsSkeleton } from "@/components/skelton/DashboardChartsSkeleton";
import DashboardPageSkeleton from "@/components/skelton/DashboardPageSkeleton";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { MillDashboardResponse } from "@/types/dashboard";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  const currentYear = new Date().getFullYear();
  const minYear = 2024;
  const years = Array.from({ length: currentYear - minYear + 1 }, (_, i) =>
    (currentYear - i).toString()
  );

  const yearFromUrl = Number(searchParams.get("year")) || currentYear;

  const [year, setYear] = useState<number>(yearFromUrl);
  const [isSensitive, setIsSensitive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] =
    useState<MillDashboardResponse | null>(null);

  /* ---------- Auth Guard ---------- */
  useEffect(() => {
    if (!isSessionPending && !session?.user) {
      toast.error("Session expired");
      router.replace("/login");
    }
  }, [session, isSessionPending, router]);

  /* ---------- URL Sync ---------- */
  useEffect(() => {
    const urlYear = searchParams.get("year");
    if (String(year) !== urlYear) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("year", String(year));
      router.replace(`/dashboard?${params.toString()}`, { scroll: false });
    }
  }, [year, searchParams, router]);

  /* ---------- Fetch Data ---------- */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/dashboard?year=${year}`);
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const result = await res.json();
        setDashboardData(result.data);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  if (isSessionPending) {
    return <DashboardPageSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Breadcrumb & Header */}
      <PageHeader
        items={[{ label: "Dashboard" }]}
        actions={
          <div className="flex items-center gap-2">
            {/* Year Selector Dropdown */}
            <Select
              value={String(year)}
              onValueChange={(val) => setYear(Number(val))}
            >
              <SelectTrigger className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl border border-border/80 bg-secondary/40 hover:bg-secondary/70 text-xs font-semibold focus:ring-1 focus:ring-primary/40 cursor-pointer w-auto min-w-[95px] sm:min-w-[110px] gap-1.5">
                <div className="flex items-center gap-1.5 text-foreground">
                  <CalendarIcon className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-muted-foreground text-[11px] font-normal">FY</span>
                  <SelectValue placeholder="Year" />
                </div>
              </SelectTrigger>
              <SelectContent align="end" className="rounded-xl border border-border/80">
                {years.map((y) => (
                  <SelectItem key={y} value={y} className="text-xs font-semibold cursor-pointer">
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Privacy Mask Toggler */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSensitive((v) => !v)}
              title={isSensitive ? "Show monetary values" : "Mask sensitive values"}
              className={cn(
                "h-9 w-9 sm:h-10 sm:w-10 rounded-xl border border-border/80 bg-secondary/40 hover:bg-secondary/70 transition-all active:scale-95 shrink-0",
                isSensitive && "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
              )}
              aria-label={isSensitive ? "Show monetary values" : "Mask sensitive values"}
            >
              {isSensitive ? (
                <EyeOff className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <Eye className="h-4 w-4 text-primary" />
              )}
            </Button>
          </div>
        }
      />

      {/* Summary Cards Grid */}
      <section aria-label="Financial Summary Cards">
        <SummaryCards
          income={dashboardData?.summary.netIncome ?? 0}
          saving={dashboardData?.summary.netSaving ?? 0}
          grindingStats={dashboardData?.grindingStats}
          data={dashboardData?.summary}
          isLoading={loading}
          isSensitive={isSensitive}
        />
      </section>

      {/* Visual Analytics & Trajectory Section */}
      <section aria-label="Visual Analytics & Charts">
        {dashboardData ? (
          <DashboardCharts
            creditData={dashboardData.monthlyCredit}
            debitMillData={dashboardData.monthlyMillDebit}
            debitHomeData={dashboardData.monthlyHomeDebit}
          />
        ) : (
          <DashboardChartsSkeleton />
        )}
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
