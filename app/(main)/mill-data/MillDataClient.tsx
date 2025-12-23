"use client";

import { Suspense, useEffect, useState, useMemo, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import {
  EMPTY_MONTHLY_STAT,
  MillData,
  MonthlyStatResponse,
  MonthlyTotalStat,
} from "@/types/mill-data";
import {
  Search,
  X,
  TrendingUp,
  TrendingDown,
  Filter,
  Eye,
  EyeOff,
  Wallet,
  PiggyBank,
  Calendar,
  DownloadIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formateIndDate, formatRs } from "@/lib/helper";

import MillDataPageSkeleton from "@/components/skelton/MillDataPageSkeleton";
import StatCard2 from "@/components/millData/StatCard2";
import StatCard from "@/components/millData/StatCard";
import StatItem from "@/components/millData/StatItem";
import TableComponent from "@/components/millData/TableComponent";
import { handleExportToExcel } from "@/lib/handleExportToExcel";

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(0, i).toLocaleString("default", { month: "long" }),
}));

function MillDataContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  // Date Initialization
  const now = new Date();
  const [year, setYear] = useState(
    () => searchParams.get("year") ?? String(now.getFullYear())
  );
  const [month, setMonth] = useState(
    () => searchParams.get("month") ?? String(now.getMonth() + 1)
  );

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [isSensitive, setIsSensitive] = useState(true);
  const [rows, setRows] = useState<MillData[]>([]);
  const [total, setTotal] = useState<MonthlyTotalStat>(EMPTY_MONTHLY_STAT);
  const [loading, setLoading] = useState(false);

  /* -------- Auth Guard -------- */
  useEffect(() => {
    if (!isSessionPending && !session?.user) {
      toast.error("Session expired");
      router.replace("/login");
    }
  }, [session, isSessionPending, router]);

  /* -------- URL Sync -------- */
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (params.get("year") !== year || params.get("month") !== month) {
      params.set("year", year);
      params.set("month", month);
      router.replace(`/mill-data?${params.toString()}`, { scroll: false });
    }
  }, [year, month, router, searchParams]);

  /* -------- Fetch Data -------- */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/mill-data?year=${year}&month=${month}`);
        if (!res.ok) throw new Error("Failed to fetch mill data");

        const result: MonthlyStatResponse = await res.json();
        setRows(result.data.items ?? []);
        setTotal(result.data.totals ?? EMPTY_MONTHLY_STAT);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year, month]);

  /* -------- Optimized Search Filtering -------- */
  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) => {
      const dateStr = new Date(row.createdAt)
        .toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
        .toLowerCase();

      return (
        row.millCredit.toString().includes(query) ||
        row.flourRs.toString().includes(query) ||
        row.oilRs.toString().includes(query) ||
        row.sarsoRs.toString().includes(query) ||
        row.khariRs.toString().includes(query) ||
        row.gehumRs.toString().includes(query) ||
        row.totalCredit.toString().includes(query) ||
        row.totalDebit.toString().includes(query) ||
        row.staff1Rs.toString().includes(query) ||
        row.staff2Rs.toString().includes(query) ||
        row.staffDescription?.toLowerCase().includes(query) ||
        row.millDescription?.toLowerCase().includes(query) ||
        row.homeDescription?.toLowerCase().includes(query) ||
        dateStr.includes(query)
      );
    });
  }, [searchQuery, rows]);

  // Derived Values
  const income = total.totalCredit - total.totalDebit + total.homeDebit;
  const saving = total.totalCredit - total.totalDebit;
  const currentYear = now.getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  // Handlers
  const handleYearChange = useCallback((val: string) => {
    setYear(val);
    setSearchQuery("");
  }, []);

  const handleMonthChange = useCallback((val: string) => {
    setMonth(val);
    setSearchQuery("");
  }, []);

  if (isSessionPending) {
    return <MillDataPageSkeleton />;
  }

  if (!session?.session) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold rounded-md border bg-muted px-3 py-1">
          Monthly Data
        </h1>
        <div className="flex items-center gap-2">
          <div
            onClick={() => toast.error("Date is view only")}
            className="flex items-center justify-center gap-2 rounded-md border bg-muted hover:bg-primary/20 px-3 py-2 text-sm font-medium transition-colors"
          >
            <Calendar className="h-4 w-4 text-primary" />
            <span className="tabular-nums">
              {formateIndDate(new Date(`${year}-${month}-01`)).slice(2)}
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSensitive((prev) => !prev)}
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

      {/* Summary Cards Section */}
      <div className="grid grid-cols-2 gap-4 lg:gap-6">
        <StatCard2
          label="Total Income"
          icon={Wallet}
          value={formatRs(income)}
          isLoading={loading}
          isSensitive={isSensitive}
          variant="purple"
        />

        <StatCard2
          label="Net Savings"
          icon={PiggyBank}
          value={formatRs(saving)}
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
          headerValue={formatRs(total.totalCredit)}
          isLoading={loading}
          isSensitive={isSensitive}
        >
          <StatItem
            label="Mill Credit"
            value={total.millCredit}
            statItemBgClass={`bg-green-50/40 dark:bg-green-900/10`}
            colorClass={`text-green-600 dark:text-green-400`}
            isSensitive={isSensitive}
          />
          <StatItem
            label="Flour"
            value={total.flourRs}
            sub={total.flourWeight}
            statItemBgClass={`bg-green-50/40 dark:bg-green-900/10`}
            colorClass={`text-green-600 dark:text-green-400`}
            isSensitive={isSensitive}
          />
          <StatItem
            label="Oil"
            value={total.oilRs}
            sub={total.oilWeight}
            statItemBgClass={`bg-green-50/40 dark:bg-green-900/10`}
            colorClass={`text-green-600 dark:text-green-400`}
            isSensitive={isSensitive}
          />
          <StatItem
            label="Khari"
            value={total.khariRs}
            sub={total.khariWeight}
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
          headerValue={formatRs(total.totalDebit)}
          isLoading={loading}
          isSensitive={isSensitive}
        >
          <StatItem
            label="Gehum"
            value={total.gehumRs}
            sub={total.gehumWeight}
            statItemBgClass={`bg-red-50/40 dark:bg-red-900/10`}
            colorClass="text-red-600 dark:text-red-400"
            isSensitive={isSensitive}
          />
          <StatItem
            label="Sarso"
            value={total.sarsoRs}
            sub={total.sarsoWeight}
            statItemBgClass={`bg-red-50/40 dark:bg-red-900/10`}
            colorClass="text-red-600 dark:text-red-400"
            isSensitive={isSensitive}
          />
          <div className="grid md:grid-cols-2 gap-2">
            <StatItem
              label="Home"
              value={total.homeDebit}
              statItemBgClass={`bg-red-50/40 dark:bg-red-900/10`}
              colorClass="text-red-600 dark:text-red-400"
              isSensitive={isSensitive}
            />
            <StatItem
              label="Mill"
              value={total.millDebit}
              statItemBgClass={`bg-red-50/40 dark:bg-red-900/10`}
              colorClass="text-red-600 dark:text-red-400"
              isSensitive={isSensitive}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            <StatItem
              label="Staff1"
              value={total.staff1Rs}
              statItemBgClass={`bg-red-50/40 dark:bg-red-900/10`}
              colorClass="text-red-600 dark:text-red-400"
              isSensitive={isSensitive}
            />
            <StatItem
              label="Staff2"
              value={total.staff2Rs}
              statItemBgClass={`bg-red-50/40 dark:bg-red-900/10`}
              colorClass="text-red-600 dark:text-red-400"
              isSensitive={isSensitive}
            />
          </div>
        </StatCard>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-border shadow-sm bg-card flex flex-col">
        {/* table card heder */}
        <div className="p-4 border-b bg-muted/10">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            {/* Table search bar */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search amount, description…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-9 bg-background"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* filter + export */}
            <div className="flex flex-wrap items-center gap-2 justify-between lg:justify-end">
              {/* filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <Select value={month} onValueChange={handleMonthChange}>
                  <SelectTrigger className="w-auto bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={year} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-auto bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Export */}
              <Button
                onClick={() =>
                  handleExportToExcel({
                    data: rows,
                    totals: total,
                    year: year,
                    month: month,
                  })
                }
              >
                <DownloadIcon className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* actual table  */}
        <div className="overflow-x-auto">
          <TableComponent
            loading={loading}
            isPending={isSessionPending}
            filteredRows={filteredRows}
          />
        </div>

        {/* table card footer */}
        <div className="bg-muted/40 border-t p-4 rounded-b-xl">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="text-foreground font-bold">
              {filteredRows.length}
            </span>{" "}
            entries
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MillDataClient() {
  return (
    <Suspense fallback={<MillDataPageSkeleton />}>
      <MillDataContent />
    </Suspense>
  );
}
