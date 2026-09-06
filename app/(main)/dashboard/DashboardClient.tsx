"use client";

import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import SummaryCards from "@/components/millData/SummaryCards";
import { DashboardChartsSkeleton } from "@/components/skelton/DashboardChartsSkeleton";
import DashboardPageSkeleton from "@/components/skelton/DashboardPageSkeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { MillDashboardResponse } from "@/types/dashboard";
import {
  CalendarIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const currentYear = new Date().getFullYear();
  const minYear = 2024;
  const years = Array.from({ length: currentYear - minYear + 1 }, (_, i) =>
    (currentYear - i).toString()
  );

  const yearFromUrl = Number(searchParams.get("year")) || currentYear;

  const [year, setYear] = useState<number>(yearFromUrl);
  const [isSensitive, setIsSensitive] = useState(true);
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
      {/* ---------- Header ---------- */}
      <div className="flex items-center justify-between">
        <h1 className="rounded-md border bg-muted px-3 py-1 text-xl font-bold">
          Dashboard
        </h1>

        <div className="flex items-center gap-2">
          <CalendarIcon className="text-primary size-5" />
          <Select
            value={String(year)}
            onValueChange={(val) => setYear(Number(val))}
          >
            <SelectTrigger className="ring-0">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSensitive((v) => !v)}
            title={isSensitive ? "Show values" : "Hide values"}
            className="bg-muted hover:bg-primary/20"
          >
            {isSensitive ? (
              <Eye className="h-4 w-4 text-primary" />
            ) : (
              <EyeOff className="h-4 w-4 text-primary" />
            )}
          </Button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <SummaryCards
        income={dashboardData?.summary.netIncome ?? 0}
        saving={dashboardData?.summary.netSaving ?? 0}
        grindingStats={dashboardData?.grindingStats}
        data={dashboardData?.summary}
        isLoading={loading}
        isSensitive={isSensitive}
      />

      {/* Add Charts Section below SummaryCards */}
      {dashboardData ? (
        <DashboardCharts
          creditData={dashboardData.monthlyCredit}
          debitMillData={dashboardData.monthlyMillDebit}
          debitHomeData={dashboardData.monthlyHomeDebit}
        />
      ) : (
        <DashboardChartsSkeleton />
      )}
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
