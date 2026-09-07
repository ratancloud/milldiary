"use client";

import { Suspense, useEffect, useState, useMemo, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import {
  EMPTY_GRINDING_STAT,
  EMPTY_TOTAL_STAT,
  MillData,
  GrindingStat,
  MonthlyStatResponse,
  TotalStat,
} from "@/types/mill-data";
import {
  Search,
  X,
  Filter,
  Eye,
  EyeOff,
  Calendar,
  DownloadIcon,
  Plus,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
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
import { formateIndDate } from "@/lib/helper";

import MillDataPageSkeleton from "@/components/skelton/MillDataPageSkeleton";
import SummaryCards from "@/components/millData/SummaryCards";
import TableComponent from "@/components/millData/TableComponent";
import { handleExportToExcel } from "@/lib/handleExportToExcel";
import { cn } from "@/lib/utils";

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
  const [total, setTotal] = useState<TotalStat>(EMPTY_TOTAL_STAT);
  const [grindingStats, setGrindingStats] = useState<GrindingStat>(
    EMPTY_GRINDING_STAT
  );
  const [loading, setLoading] = useState(true);

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
        setTotal(result.data.totals ?? EMPTY_TOTAL_STAT);
        setGrindingStats(
          result.data.grindingStats ?? EMPTY_GRINDING_STAT
        );
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
      {/* Page Breadcrumb & Header */}
      <PageHeader
        items={[
          { label: "Mill Data", href: "/mill-data" },
          { label: `${formateIndDate(new Date(`${year}-${month}-01`)).slice(2)}` }
        ]}
        actions={
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
        }
      />

      {/* Summary Cards Grid */}
      <SummaryCards
        income={income}
        saving={saving}
        grindingStats={grindingStats}
        data={total}
        isLoading={loading}
        isSensitive={isSensitive}
      />

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
                    grindingStats: grindingStats,
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
