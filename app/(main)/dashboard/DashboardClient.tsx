"use client";

import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import StatCard from "@/components/millData/StatCard";
import StatCard2 from "@/components/millData/StatCard2";
import StatItem from "@/components/millData/StatItem";
import { DashboardChartsSkeleton } from "@/components/skelton/DashboardChartsSkeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { formatRs } from "@/lib/helper";
import { MillDashboardResponse } from "@/types/dashboard";
import {
  CalendarIcon,
  Eye,
  EyeOff,
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Loader2,
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
  const [loading, setLoading] = useState(false);
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

      {/* Yearly summary card  */}
      <div className="grid grid-cols-2 gap-4 lg:gap-6">
        <StatCard2
          label="Income"
          icon={Wallet}
          value={formatRs(dashboardData?.summary.netIncome ?? 0)}
          isLoading={loading}
          isSensitive={isSensitive}
          variant="purple"
        />
        <StatCard2
          label="Saving"
          icon={PiggyBank}
          value={formatRs(dashboardData?.summary.netSaving ?? 0)}
          isLoading={loading}
          isSensitive={isSensitive}
          variant="blue"
        />
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* creadit data */}
        <StatCard
          icon={TrendingUp}
          label="Total Credits"
          headerValue={formatRs(dashboardData?.summary.totalCredit)}
          isLoading={loading}
          isSensitive={isSensitive}
        >
          <StatItem
            label="Mill Credit"
            value={dashboardData?.summary.tMillCredit || 0}
            statItemBgClass={`bg-green-50/40 dark:bg-green-900/10`}
            colorClass={`text-green-600 dark:text-green-400`}
            isSensitive={isSensitive}
          />
          <StatItem
            label="Flour"
            value={dashboardData?.summary.tFlourRs || 0}
            sub={dashboardData?.summary.tFlourWeight || 0}
            statItemBgClass={`bg-green-50/40 dark:bg-green-900/10`}
            colorClass={`text-green-600 dark:text-green-400`}
            isSensitive={isSensitive}
          />
          <StatItem
            label="Oil"
            value={dashboardData?.summary.tOilRs || 0}
            sub={dashboardData?.summary.tOilWeight || 0}
            statItemBgClass={`bg-green-50/40 dark:bg-green-900/10`}
            colorClass={`text-green-600 dark:text-green-400`}
            isSensitive={isSensitive}
          />
          <StatItem
            label="Khari"
            value={dashboardData?.summary.tKhariRs || 0}
            sub={dashboardData?.summary.tKhariWeight || 0}
            statItemBgClass={`bg-green-50/40 dark:bg-green-900/10`}
            colorClass={`text-green-600 dark:text-green-400`}
            isSensitive={isSensitive}
          />
        </StatCard>

        {/* debit data */}
        <StatCard
          icon={TrendingDown}
          label="Total Debits"
          headerClassName={`bg-red-50/40 dark:bg-red-900/10`}
          titleClassName={`text-red-600 dark:text-red-400`}
          headerValueClassName={`text-red-700 dark:text-red-400`}
          headerValue={formatRs(dashboardData?.summary.totalDebit)}
          isLoading={loading}
          isSensitive={isSensitive}
        >
          <StatItem
            label="Gehum"
            value={dashboardData?.summary.tGehumRs || 0}
            sub={dashboardData?.summary.tGehumWeight || 0}
            statItemBgClass={`bg-red-50/40 dark:bg-red-900/10`}
            colorClass="text-red-600 dark:text-red-400"
            isSensitive={isSensitive}
          />
          <StatItem
            label="Sarso"
            value={dashboardData?.summary.tSarsoRs || 0}
            sub={dashboardData?.summary.tSarsoWeight || 0}
            statItemBgClass={`bg-red-50/40 dark:bg-red-900/10`}
            colorClass="text-red-600 dark:text-red-400"
            isSensitive={isSensitive}
          />
          <div className="grid md:grid-cols-2 gap-2">
            <StatItem
              label="Home"
              value={dashboardData?.summary.tHomeDebit || 0}
              statItemBgClass={`bg-red-50/40 dark:bg-red-900/10`}
              colorClass="text-red-600 dark:text-red-400"
              isSensitive={isSensitive}
            />
            <StatItem
              label="Mill"
              value={dashboardData?.summary.tMillDebit || 0}
              statItemBgClass={`bg-red-50/40 dark:bg-red-900/10`}
              colorClass="text-red-600 dark:text-red-400"
              isSensitive={isSensitive}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            <StatItem
              label="Bhim"
              value={dashboardData?.summary.tStaff1Rs || 0}
              statItemBgClass={`bg-red-50/40 dark:bg-red-900/10`}
              colorClass="text-red-600 dark:text-red-400"
              isSensitive={isSensitive}
            />
            <StatItem
              label="Viswa"
              value={dashboardData?.summary.tStaff2Rs || 0}
              statItemBgClass={`bg-red-50/40 dark:bg-red-900/10`}
              colorClass="text-red-600 dark:text-red-400"
              isSensitive={isSensitive}
            />
          </div>
        </StatCard>
      </div>

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
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
