"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { GrindingLedger } from "@/types/grinding-ledger";
import { formateIndDate, formatKg } from "@/lib/helper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  NotebookText,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


interface GrindingLedgerTableProps {
  items: GrindingLedger[];
  isLoading: boolean;
  onEdit: (item: GrindingLedger) => void;
  onDelete: (id: string) => Promise<void>;
}

/* ─────────────────────────────────────────────
   Premium Mobile Card  (memoised – skip re-render on unrelated state)
   Rate: ₹3 per kg — hardcoded, update when API provides dynamic rate
───────────────────────────────────────────── */
const RATE_PER_KG = 3; // ₹ per kg

const MobileCard = memo(function MobileCard({
  row,
  onEdit,
  onSetDeleting,
}: {
  row: GrindingLedger;
  onEdit: (item: GrindingLedger) => void;
  onSetDeleting: (item: GrindingLedger) => void;
}) {
  const totalPrice = Math.round(row.weight * RATE_PER_KG);
  const isWheat = row.commodityType === "WHEAT";

  return (
    <div
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 110px" }}
      className="relative flex rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm active:scale-[0.99] transition-transform"
    >
      {/* ── Left panel: serial circle + commodity label at bottom ── */}
      <div className="flex flex-col items-center justify-between gap-0 px-3 py-3 bg-primary/8 border-r border-border/40 shrink-0 min-w-[52px]">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-mono font-black text-xs shadow-sm">
          {row.serialNo}
        </div>
        <span className="text-[9px] font-bold text-primary/70 mt-1 tracking-wide leading-none">
          {isWheat ? "Wheat" : "Sarso"}
        </span>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-2.5 px-3 gap-1">
        {/* Top row: name block */}
        <div className="min-w-0">
          <p
            className="font-bold text-[14px] text-foreground leading-snug"
            style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {row.customerNameEn}
          </p>
          <p
            className="text-[11px] text-muted-foreground font-hindi"
            style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: "1.6" }}
          >
            {row.customerNameHi}
          </p>
          <p
            className="text-[10px] text-muted-foreground/65 mt-0.5"
            style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {row.villageEn}
            {row.villageHi
              ? <span className="font-hindi text-muted-foreground/50"> / {row.villageHi}</span>
              : null}
          </p>
        </div>

        {/* Bottom row: weight + price + actions */}
        <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-border/40">
          {/* Weight & price pill */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-[15px] tabular-nums text-foreground leading-none">
              {formatKg(row.weight)}
              <span className="text-[10px] font-normal text-muted-foreground ml-0.5">kg</span>
            </span>
            <span className="text-[11px] font-semibold text-primary tabular-nums leading-none">
              · ₹{totalPrice}
            </span>
          </div>

          {/* 3-dot actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg -mr-1 shrink-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 rounded-xl shadow-lg">
              <DropdownMenuItem
                onClick={() => onEdit(row)}
                className="cursor-pointer flex items-center gap-2 font-medium py-2 text-sm"
              >
                <Edit className="h-3.5 w-3.5 text-blue-500" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSetDeleting(row)}
                className="cursor-pointer flex items-center gap-2 font-medium py-2 text-sm text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────
   Chunked list: renders first 30, then streams
   remaining in idle-callback batches so the
   initial paint is always fast.
───────────────────────────────────────────── */
const INITIAL_BATCH = 30;
const BATCH_SIZE = 30;

function useChunkedItems(items: GrindingLedger[]) {
  const [visibleCount, setVisibleCount] = useState(
    Math.min(INITIAL_BATCH, items.length)
  );

  // Reset when list changes (new date / filter)
  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_BATCH, items.length));
  }, [items]);

  // Incrementally reveal more rows while browser is idle
  useEffect(() => {
    if (visibleCount >= items.length) return;

    const id = (window.requestIdleCallback || window.setTimeout)(
      () => {
        setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, items.length));
      },
      { timeout: 300 }
    );

    return () => {
      (window.cancelIdleCallback || window.clearTimeout)(id as number);
    };
  }, [visibleCount, items.length]);

  return items.slice(0, visibleCount);
}

/* ─────────────────────────────────────────────
   Main table component
───────────────────────────────────────────── */
const GrindingLedgerTable: React.FC<GrindingLedgerTableProps> = ({
  items,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const [deletingRow, setDeletingRow] = useState<GrindingLedger | null>(null);
  const visibleItems = useChunkedItems(items);

  const handleSetDeleting = useCallback((row: GrindingLedger) => {
    setDeletingRow(row);
  }, []);

  const handleEdit = useCallback(
    (row: GrindingLedger) => {
      onEdit(row);
    },
    [onEdit]
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Desktop skeleton matching real table columns */}
        <div className="hidden md:block rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="divide-y divide-border/60 p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile skeleton matching real MobileCard structure */}
        <div className="block md:hidden space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative flex rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm h-[110px]"
            >
              <div className="w-[52px] bg-primary/5 border-r border-border/40 flex flex-col items-center justify-center gap-2 p-2 shrink-0">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-6 h-3 rounded-full" />
              </div>
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                  <Skeleton className="h-3 w-2/3 rounded-md" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-7 w-7 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 md:p-12 text-center bg-card/50 flex flex-col items-center justify-center gap-3">
        <div className="p-4 rounded-full bg-muted/60 text-muted-foreground">
          <NotebookText className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-lg text-foreground">No Ledger Records Found</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          No grinding slips found for the selected filter criteria. Try changing the month, commodity type, or click &quot;+ Add Entry&quot; or &quot;AI OCR Upload&quot; to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ─── Mobile List (compact, chunked, content-visibility) ─── */}
      <div className="block md:hidden space-y-1.5">
        {/* Count header */}
        <div className="flex items-center justify-between px-1 pb-0.5">
          <span className="text-xs text-muted-foreground font-medium">
            {items.length} slip{items.length !== 1 ? "s" : ""}
          </span>
          {visibleItems.length < items.length && (
            <span className="text-[10px] text-muted-foreground/60">
              Showing {visibleItems.length}…
            </span>
          )}
        </div>

        {visibleItems.map((row) => (
          <MobileCard
            key={row.id}
            row={row}
            onEdit={handleEdit}
            onSetDeleting={handleSetDeleting}
          />
        ))}
      </div>

      {/* ─── Desktop Table ─── */}
      <div className="hidden md:block rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[110px] font-bold">Date</TableHead>
                <TableHead className="w-[80px] text-center font-bold">S.No</TableHead>
                <TableHead className="w-[120px] font-bold">Commodity</TableHead>
                <TableHead className="font-bold">Customer Name</TableHead>
                <TableHead className="font-bold">Village</TableHead>
                <TableHead className="text-right font-bold">Weight (Kg)</TableHead>
                <TableHead className="w-[100px] text-center font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row) => {
                const isWheat = row.commodityType === "WHEAT";
                return (
                  <TableRow key={row.id} className="hover:bg-muted/40 transition-colors">
                    <TableCell className="font-medium whitespace-nowrap">
                      {formateIndDate(new Date(row.date))}
                    </TableCell>
                    <TableCell className="text-center font-bold font-mono">
                      #{row.serialNo}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/30 font-semibold"
                      >
                        {isWheat ? "Wheat" : "Mustard"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          {row.customerNameEn}
                        </span>
                        <span className="text-xs text-muted-foreground font-hindi">
                          {row.customerNameHi}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {row.villageEn}
                        </span>
                        <span className="text-xs text-muted-foreground font-hindi">
                          {row.villageHi}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold tabular-nums text-foreground">
                      {formatKg(row.weight)} Kg
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-blue-500"
                          onClick={() => onEdit(row)}
                          title="Edit Entry"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-500"
                          onClick={() => setDeletingRow(row)}
                          title="Delete Entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ─── Delete Confirmation Modal ─── */}
      <AlertDialog
        open={!!deletingRow}
        onOpenChange={(open: boolean) => !open && setDeletingRow(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" /> Delete Grinding Record?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete slip{" "}
              <span className="font-bold text-foreground">
                #{deletingRow?.serialNo} ({deletingRow?.customerNameEn})
              </span>{" "}
              for {deletingRow?.commodityType}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingRow(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deletingRow) {
                  await onDelete(deletingRow.id);
                  setDeletingRow(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GrindingLedgerTable;
