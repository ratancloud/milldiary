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
} from "lucide-react";
import {
  EMPTY_GRINDING_LEDGER_STAT,
  GrindingLedger,
  GrindingLedgerStat,
} from "@/types/grinding-ledger";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import GrindingLedgerStats from "@/components/grindingLedger/GrindingLedgerStats";
import GrindingLedgerTable from "@/components/grindingLedger/GrindingLedgerTable";
import GrindingLedgerCreateModal from "@/components/grindingLedger/GrindingLedgerCreateModal";
import DayScroller from "@/components/grindingLedger/DayScroller";
import GrindingLedgerPageSkeleton from "@/components/skelton/GrindingLedgerPageSkeleton";
import { handleExportGrindingLedger } from "@/lib/handleExportGrindingLedger";

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
    <div className="container max-w-7xl mx-auto p-3 sm:p-6 md:p-8 space-y-4 md:space-y-6">
      {/* Page Top Header Bar */}
      <div className="flex items-center justify-between">
        <h1 className="rounded-md border bg-muted px-3 py-1 text-xl font-bold">
          Ledger
        </h1>
        <div className="flex items-center gap-2.5 w-fit sm:w-auto">
          <Button
            onClick={handleExport}
            variant="outline"
            className="gap-1.5 font-semibold text-xs sm:text-sm h-10 px-3.5 rounded-xl border-border/80"
            title="Export Excel"
          >
            <DownloadIcon className="w-4 h-4 shrink-0" /> Export
          </Button>

          <Button
            type="button"
            onClick={() => router.push("/grinding-ledger/new")}
          >
            <Plus className="w-4 h-4 shrink-0" />Add
          </Button>
        </div>
      </div>

      {/* Compact Collapsible Daily Stat Card */}
      <GrindingLedgerStats stats={stats} isLoading={loading || isSessionPending} />

      {/* 7-Day Scroller & Date Jump Controls */}
      <DayScroller
        selectedDate={selectedDate}
        onSelectDate={(newDate) => setSelectedDate(newDate)}
      />

      {/* Toolbar: Commodity Toggle & Client-Side Search */}
      <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Two-Way Commodity Toggle */}
        <div className="flex items-center p-1 bg-muted/60 rounded-xl text-xs font-bold sm:w-auto">
          <button
            onClick={() => setCommodityFilter("WHEAT")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${commodityFilter === "WHEAT"
              ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Wheat (गेहूं)
          </button>
          <button
            onClick={() => setCommodityFilter("MUSTARD")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${commodityFilter === "MUSTARD"
              ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Mustard (सरसों)
          </button>
        </div>

        {/* Instant Search Input */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-[280px]">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search client, village, #S.No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-10 text-sm font-medium rounded-xl border-border/80 bg-background/50 focus:bg-background transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
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
