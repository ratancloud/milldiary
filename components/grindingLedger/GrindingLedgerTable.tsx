"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
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
  AlertTriangle,
  MoreVertical,
  Wheat,
  Sprout,
  MapPin,
  Plus,
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
import { cn } from "@/lib/utils";

interface GrindingLedgerTableProps {
  items: GrindingLedger[];
  isLoading: boolean;
  onEdit: (item: GrindingLedger) => void;
  onDelete: (id: string) => Promise<void>;
}

/* ─────────────────────────────────────────────
   Rate: ₹3 per kg (standard default)
───────────────────────────────────────────── */
const RATE_PER_KG = 3;

/* ─────────────────────────────────────────────
   Mobile Card (Memoized — matching reference design)
───────────────────────────────────────────── */
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
      className="relative flex rounded-2xl border border-border/80 dark:border-white/10 bg-card overflow-hidden shadow-2xs active:scale-[0.99] transition-transform"
    >
      {/* Left panel: serial circle at top + commodity label at bottom */}
      <div className="flex flex-col items-center justify-between gap-1 p-2.5 sm:p-3 bg-secondary/40 dark:bg-white/[0.04] border-r border-border/70 dark:border-white/10 shrink-0 min-w-[56px] sm:min-w-[62px]">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold text-xs shadow-xs">
          {row.serialNo}
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold text-primary dark:text-primary/90 tracking-wide leading-none capitalize mt-2">
          {isWheat ? "Wheat" : "Mustard"}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 p-3 sm:p-3.5 flex flex-col justify-between gap-1.5">
        {/* Top block: Customer names and village */}
        <div className="min-w-0 space-y-0.5">
          <p className="font-bold text-sm sm:text-[15px] text-foreground leading-snug truncate">
            {row.customerNameEn}
          </p>
          {row.customerNameHi && (
            <p className="text-xs text-muted-foreground font-hindi leading-tight truncate">
              {row.customerNameHi}
            </p>
          )}
          <p className="text-[11px] text-muted-foreground/75 truncate mt-0.5">
            {row.villageEn}
            {row.villageHi ? ` / ${row.villageHi}` : ""}
          </p>
        </div>

        {/* Bottom row: Weight · Price and 3-dot menu */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-baseline gap-1">
            <span className="font-extrabold text-[15px] sm:text-base tabular-nums text-foreground leading-none">
              {formatKg(row.weight)}
            </span>
            <span className="text-[11px] font-normal text-muted-foreground ml-0.5">kg</span>
            <span className="text-muted-foreground/60 mx-1">·</span>
            <span className="text-xs sm:text-sm font-bold text-primary tabular-nums leading-none">
              ₹{totalPrice}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg -mr-1 shrink-0 cursor-pointer"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 rounded-xl border-border shadow-xl">
              <DropdownMenuItem
                onClick={() => onEdit(row)}
                className="cursor-pointer flex items-center gap-2 font-medium py-2 text-xs"
              >
                <Edit className="h-3.5 w-3.5 text-primary" />
                <span>Edit Slip</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSetDeleting(row)}
                className="cursor-pointer flex items-center gap-2 font-medium py-2 text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Slip</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────
   Chunked list for performance
───────────────────────────────────────────── */
const INITIAL_BATCH = 30;
const BATCH_SIZE = 30;

function useChunkedItems(items: GrindingLedger[]) {
  const [visibleCount, setVisibleCount] = useState(
    Math.min(INITIAL_BATCH, items.length)
  );

  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_BATCH, items.length));
  }, [items]);

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
   Main Table Component
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
        {/* Desktop skeleton */}
        <div className="hidden md:block rounded-2xl border border-border/80 dark:border-white/10 bg-card overflow-hidden shadow-[var(--card-shadow)]">
          <div className="p-4 border-b border-border/60 bg-secondary/30 flex items-center justify-between">
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="h-5 w-44 rounded-md" />
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
          <div className="divide-y divide-border/50 p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2.5">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-12 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
                <div className="flex gap-1.5">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile skeleton */}
        <div className="block md:hidden space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex rounded-2xl border border-border/80 dark:border-white/10 bg-card overflow-hidden shadow-2xs h-[108px]"
            >
              {/* Left vertical strip skeleton */}
              <div className="flex flex-col items-center justify-between p-2.5 sm:p-3 bg-secondary/40 dark:bg-white/[0.04] border-r border-border/70 dark:border-white/10 shrink-0 min-w-[56px] sm:min-w-[62px]">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-2.5 w-9 rounded-sm mt-2" />
              </div>

              {/* Right main content skeleton */}
              <div className="flex-1 min-w-0 p-3 sm:p-3.5 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                  <Skeleton className="h-2.5 w-28 rounded" />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-6 w-6 rounded-md" />
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
      <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3.5 shadow-2xs">
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
          <NotebookText className="w-8 h-8" />
        </div>
        <div className="space-y-1 max-w-md">
          <h3 className="font-bold text-base sm:text-lg text-foreground tracking-tight">
            No Grinding Records Found
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            There are no customer slips logged for the selected date and filter. Switch commodity types, select another day, or log a new slip.
          </p>
        </div>
        <Button
          className="mt-2 rounded-xl text-xs font-bold gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer active:scale-[0.98]"
          asChild
        >
          <Link href="/grinding-ledger/new">
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Slip</span>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ─── Mobile View (Cards) ─── */}
      <div className="block md:hidden space-y-2.5">
        <div className="flex items-center justify-between px-1 text-xs text-muted-foreground font-semibold">
          <span>
            {items.length} {items.length === 1 ? "Slip" : "Slips"} found
          </span>
          {visibleItems.length < items.length && (
            <span className="text-[11px] font-mono text-muted-foreground/70">
              Showing {visibleItems.length} of {items.length}
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

      {/* ─── Desktop View (Table) ─── */}
      <div className="hidden md:block rounded-2xl border border-border/80 dark:border-white/10 bg-card shadow-[var(--card-shadow)] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/40 border-b border-border/70">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[115px] font-bold font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Date
                </TableHead>
                <TableHead className="w-[85px] text-center font-bold font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  S.No
                </TableHead>
                <TableHead className="w-[130px] font-bold font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Commodity
                </TableHead>
                <TableHead className="font-bold font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Customer
                </TableHead>
                <TableHead className="font-bold font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Village
                </TableHead>
                <TableHead className="text-right font-bold font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Weight (Kg)
                </TableHead>
                <TableHead className="text-right font-bold font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Amount
                </TableHead>
                <TableHead className="w-[105px] text-center font-bold font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/50">
              {items.map((row) => {
                const isWheat = row.commodityType === "WHEAT";
                const totalPrice = Math.round(row.weight * RATE_PER_KG);
                return (
                  <TableRow key={row.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell className="font-mono text-xs font-medium whitespace-nowrap text-muted-foreground">
                      {formateIndDate(new Date(row.date))}
                    </TableCell>
                    <TableCell className="text-center font-bold font-mono text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-secondary/80 text-foreground border border-border/50">
                        #{row.serialNo}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-bold gap-1 px-2.5 py-0.5 rounded-lg border",
                          isWheat
                            ? "bg-primary/10 text-primary border-primary/25"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
                        )}
                      >
                        {isWheat ? <Wheat className="w-3.5 h-3.5" /> : <Sprout className="w-3.5 h-3.5" />}
                        <span>{isWheat ? "Wheat" : "Mustard"}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground">
                          {row.customerNameEn}
                        </span>
                        {row.customerNameHi && (
                          <span className="text-xs text-muted-foreground font-hindi">
                            {row.customerNameHi}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-foreground">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0 opacity-70" />
                        <span className="font-medium">{row.villageEn}</span>
                        {row.villageHi && (
                          <span className="text-xs text-muted-foreground font-hindi">
                            ({row.villageHi})
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-black tabular-nums text-foreground">
                      {formatKg(row.weight)} <span className="text-xs font-normal text-muted-foreground">kg</span>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-xs text-primary tabular-nums">
                      ₹{totalPrice}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/70 transition-colors cursor-pointer"
                          onClick={() => onEdit(row)}
                          title="Edit Entry"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
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
        <AlertDialogContent className="rounded-2xl border border-border/80 dark:border-white/10 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2.5 text-destructive">
              <div className="h-9 w-9 rounded-xl bg-destructive/15 border border-destructive/25 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <span>Delete Grinding Record?</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
              Are you sure you want to permanently delete slip{" "}
              <strong className="text-foreground">
                #{deletingRow?.serialNo} ({deletingRow?.customerNameEn})
              </strong>{" "}
              for {deletingRow?.commodityType === "WHEAT" ? "Wheat" : "Mustard"}? This operation cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
            <AlertDialogCancel
              onClick={() => setDeletingRow(null)}
              className="rounded-xl border border-border/80 hover:bg-secondary/70 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deletingRow) {
                  await onDelete(deletingRow.id);
                  setDeletingRow(null);
                }
              }}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-bold cursor-pointer active:scale-95"
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
