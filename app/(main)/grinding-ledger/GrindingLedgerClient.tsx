"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  Search,
  X,
  DownloadIcon,
  Plus,
  Wheat,
  Sprout,
} from "lucide-react";
import {
  EMPTY_GRINDING_LEDGER_STAT,
  GrindingLedger,
  GrindingLedgerStat,
} from "@/types/grinding-ledger";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { PageHeader } from "@/components/layout/PageHeader";
import GrindingLedgerTable from "@/components/grindingLedger/GrindingLedgerTable";
import GrindingLedgerCreateModal from "@/components/grindingLedger/GrindingLedgerCreateModal";
import DayScroller from "@/components/grindingLedger/DayScroller";
import GrindingLedgerPageSkeleton from "@/components/skelton/GrindingLedgerPageSkeleton";
import { handleExportGrindingLedger } from "@/lib/handleExportGrindingLedger";
import { formatKg } from "@/lib/helper";

export default function GrindingLedgerClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const queryClient = useQueryClient();

  // Default to today YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(() => {
    const paramDate = searchParams.get("date");
    if (paramDate) return paramDate;
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  });

  // Commodity toggle: Only WHEAT or MUSTARD (No ALL option as requested)
  const [commodityFilter, setCommodityFilter] = useState<"WHEAT" | "MUSTARD">(() => {
    const paramComm = searchParams.get("commodity");
    return paramComm === "MUSTARD" ? "MUSTARD" : "WHEAT";
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Modals state (only used for editing existing records)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GrindingLedger | null>(null);

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
    let changed = false;
    if (params.get("date") !== selectedDate) {
      params.set("date", selectedDate);
      changed = true;
    }
    if (params.get("commodity") !== commodityFilter) {
      params.set("commodity", commodityFilter);
      changed = true;
    }

    if (changed) {
      router.replace(`/grinding-ledger?${params.toString()}`, { scroll: false });
    }
  }, [selectedDate, commodityFilter, router, searchParams]);

  /* -------- TanStack Query Fetch (Day-wise + Commodity Type Cache) -------- */
  const {
    data: queryData,
    isLoading: loading,
  } = useQuery({
    queryKey: ["grindingLedger", selectedDate, commodityFilter],
    queryFn: async () => {
      const url = `/api/grinding-ledger?date=${selectedDate}&commodityType=${commodityFilter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch grinding ledger data");

      const result = await res.json();
      return {
        rows: (result.data?.items ?? []) as GrindingLedger[],
        stats: (result.data?.stats ?? EMPTY_GRINDING_LEDGER_STAT) as GrindingLedgerStat,
      };
    },
    enabled: !!session?.user,
  });

  const rows = queryData?.rows ?? [];
  const stats = queryData?.stats ?? EMPTY_GRINDING_LEDGER_STAT;

  /* -------- Client-Side Instant Search -------- */
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.trim().toLowerCase();
    return rows.filter(
      (r) =>
        r.customerNameEn.toLowerCase().includes(q) ||
        r.customerNameHi.toLowerCase().includes(q) ||
        r.villageEn.toLowerCase().includes(q) ||
        r.villageHi.toLowerCase().includes(q) ||
        String(r.serialNo).includes(q)
    );
  }, [rows, searchQuery]);

  /* -------- Actions -------- */
  const handleEdit = (item: GrindingLedger) => {
    setEditingItem(item);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/grinding-ledger/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to delete record");
      }
      toast.success("Slip deleted from Grinding Ledger");
      queryClient.invalidateQueries({ queryKey: ["grindingLedger"] });
    } catch (error: any) {
      toast.error(error.message || "Delete failed");
    }
  };

  const handleExport = () => {
    const [y, m] = selectedDate.split("-");
    const monthLabel = new Date(Number(y), Number(m) - 1, 1).toLocaleString("default", {
      month: "long",
    });
    handleExportGrindingLedger({
      data: filteredRows,
      stats,
      year: y,
      month: monthLabel,
    });
  };

  if (isSessionPending) {
    return <GrindingLedgerPageSkeleton />;
  }
  if (!session?.user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Breadcrumb & Header Actions */}
      <PageHeader
        items={[{ label: "Grinding Ledger" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={handleExport}
              variant="outline"
              className="gap-1.5 font-semibold text-xs sm:text-sm h-9 sm:h-10 px-3.5 rounded-xl border-border/80 hover:bg-secondary active:scale-[0.98] transition-all cursor-pointer shadow-xs"
              title="Export Excel"
            >
              <DownloadIcon className="w-4 h-4 shrink-0 text-primary" />
              <span className="hidden sm:inline">Export</span>
            </Button>

            <Button
              type="button"
              onClick={() => router.push("/grinding-ledger/new")}
              className="gap-1.5 font-bold text-xs sm:text-sm h-9 sm:h-10 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <span>New Slip</span>
            </Button>
          </div>
        }
      />

      {/* 7-Day Scroller & Date Jump Controls */}
      <DayScroller
        selectedDate={selectedDate}
        onSelectDate={(newDate) => setSelectedDate(newDate)}
      />

      {/* Toolbar: Commodity Toggle & Client-Side Search */}
      <div className="rounded-2xl border border-border/80 dark:border-white/10 bg-card p-3 sm:p-4 shadow-[var(--card-shadow)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Two-Way Commodity Toggle */}
        <div className="flex w-full sm:w-auto items-center p-1 rounded-xl bg-secondary/50 dark:bg-secondary/30 border border-border/80 dark:border-white/10 shadow-2xs shrink-0">
          <button
            type="button"
            onClick={() => setCommodityFilter("WHEAT")}
            className={cn(
              "flex-1 sm:flex-initial h-8 sm:h-9 px-3.5 sm:px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]",
              commodityFilter === "WHEAT"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Wheat className="w-3.5 h-3.5 shrink-0" />
            <span>Wheat (गेहूं)</span>
          </button>
          <button
            type="button"
            onClick={() => setCommodityFilter("MUSTARD")}
            className={cn(
              "flex-1 sm:flex-initial h-8 sm:h-9 px-3.5 sm:px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]",
              commodityFilter === "MUSTARD"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sprout className="w-3.5 h-3.5 shrink-0" />
            <span>Mustard (सरसों)</span>
          </button>
        </div>

        {/* Instant Search Input */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-[300px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search customer, village, #S.No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-9 h-9 sm:h-10 text-xs sm:text-sm font-medium rounded-xl border-border/80 bg-background/60 focus:bg-background transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md cursor-pointer transition-colors"
                aria-label="Clear search query"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Slips Count & Commodity Totals Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-border/80 dark:border-white/10 bg-card/80 backdrop-blur-sm shadow-2xs">
        {/* Totals: Wheat and Sarso */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-medium">Wheat:</span>
            <span className="font-bold tabular-nums text-foreground">
              {loading ? "—" : formatKg(stats.wheatWeight)}{" "}
              <span className="text-[11px] font-normal text-muted-foreground">kg</span>
            </span>
          </div>

          <div className="h-3.5 w-px bg-border/80 dark:border-white/10" />

          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-medium">Sarso:</span>
            <span className="font-bold tabular-nums text-foreground">
              {loading ? "—" : formatKg(stats.mustardWeight)}{" "}
              <span className="text-[11px] font-normal text-muted-foreground">kg</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Responsive Table / Card View */}
      <GrindingLedgerTable
        items={filteredRows}
        isLoading={loading || isSessionPending}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modals (Only used for editing an existing record) */}
      <GrindingLedgerCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingItem(null);
        }}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["grindingLedger"] })}
        editItem={editingItem}
      />
    </div>
  );
}
