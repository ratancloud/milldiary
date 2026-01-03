"use client";

import { SummaryCards } from "@/components/dashboard/SummaryCards";
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
  Building2,
  Home,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DashboardPage() {
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
          <div className="flex items-center justify-center rounded-md border bg-muted hover:bg-primary/20 pl-3 text-sm font-medium transition-colors">
            <CalendarIcon className="text-primary size-5" />
            <Select
              value={String(year)}
              onValueChange={(val) => setYear(Number(val))}
            >
              <SelectTrigger className="border-none outline-none bg-transparent dark:bg-transparent hover:bg-transparent dark:hover:bg-transparent shadow-none w-[80px]">
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
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSensitive((v) => !v)}
            title={isSensitive ? "Show values" : "Hide values"}
            className="bg-muted hover:bg-primary/20"
          >
            {isSensitive ? (
              <EyeOff className="h-4 w-4 text-primary" />
            ) : (
              <Eye className="h-4 w-4 text-primary" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Yearly summary card  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-6">
        <SummaryCards
          label="Total Credit"
          icon={TrendingUp}
          value={formatRs(dashboardData?.summary.totalCredit)}
          isLoading={loading}
          isSensitive={isSensitive}
          color="green"
        />
        <SummaryCards
          label="Total Debit"
          icon={TrendingDown}
          value={formatRs(dashboardData?.summary.totalDebit ?? 0)}
          isLoading={loading}
          isSensitive={isSensitive}
          color="red"
        />
        <SummaryCards
          label="Mill Debit"
          icon={Building2}
          value={formatRs(dashboardData?.summary.tMillDebit ?? 0)}
          isLoading={loading}
          isSensitive={isSensitive}
          color="orange"
        />
        <SummaryCards
          label="Home Debit"
          icon={Home}
          value={formatRs(dashboardData?.summary.tHomeDebit ?? 0)}
          isLoading={loading}
          isSensitive={isSensitive}
          color="purple"
        />
        <SummaryCards
          label="Income"
          icon={Wallet}
          value={formatRs(dashboardData?.summary.netIncome ?? 0)}
          isLoading={loading}
          isSensitive={isSensitive}
          color="blue"
        />
        <SummaryCards
          label="Saving"
          icon={PiggyBank}
          value={formatRs(dashboardData?.summary.netSaving ?? 0)}
          isLoading={loading}
          isSensitive={isSensitive}
          color="indigo"
        />
      </div>

      {/* icome chats  */}
      


      {/* expanse charts */}


    </div>
  );
}
