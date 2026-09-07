"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Pencil,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
} from "lucide-react";
import {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MillData } from "@/types/mill-data";
import { formateIndDate, formatKg, formatRs } from "@/lib/helper";
import TableSkelton from "./TableSkelton";
import { cn } from "@/lib/utils";

interface TableProps {
  loading: boolean;
  isPending: boolean;
  filteredRows: MillData[];
}

/**
 * Stacked commodity cell rendering:
 * Line 1: Monetary amount in bold font-mono
 * Line 2: Volume in Kg in muted font-mono
 */
const renderCommodityCell = (weight?: number, rs?: number) => {
  const hasWeight = typeof weight === "number" && weight > 0;
  const hasRs = typeof rs === "number" && rs > 0;

  if (!hasWeight && !hasRs) {
    return <span className="text-muted-foreground/40 font-mono text-xs select-none">—</span>;
  }

  return (
    <div className="flex flex-col items-end leading-tight py-0.5">
      <span className="font-mono font-semibold text-xs text-foreground tracking-tight">
        {hasRs ? `₹${formatRs(rs)}` : "—"}
      </span>
      {hasWeight && (
        <span className="font-mono text-[10px] text-muted-foreground/80 mt-0.5 whitespace-nowrap">
          {formatKg(weight)} Kg
        </span>
      )}
    </div>
  );
};

/**
 * Single monetary figure rendering with fallback em-dash
 */
const renderMoneyCell = (val?: number, alwaysShow = false, className?: string) => {
  const num = typeof val === "number" ? val : 0;
  if (!alwaysShow && num === 0) {
    return <span className="text-muted-foreground/40 font-mono text-xs select-none">—</span>;
  }
  return (
    <span className={cn("font-mono font-semibold text-xs tabular-nums text-foreground", className)}>
      ₹{formatRs(num)}
    </span>
  );
};

/**
 * Profit / Deficit net balance badge
 */
const renderNetBadge = (net: number) => {
  if (net > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap shadow-2xs">
        <ArrowUpRight className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
        +₹{formatRs(net)}
      </span>
    );
  }
  if (net < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 whitespace-nowrap shadow-2xs">
        <ArrowDownRight className="h-3 w-3 text-rose-600 dark:text-rose-400 shrink-0" />
        -₹{formatRs(Math.abs(net))}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium text-muted-foreground bg-secondary/50 border border-border/60">
      ₹0
    </span>
  );
};

const TableComponent: React.FC<TableProps> = ({ loading, isPending, filteredRows }) => {
  // Aggregate column totals for filtered dataset
  const totals = useMemo(() => {
    if (!filteredRows.length) return null;

    return filteredRows.reduce(
      (acc, r) => {
        acc.totalCredit += r.totalCredit || 0;
        acc.millCredit += r.millCredit || 0;
        acc.flourRs += r.flourRs || 0;
        acc.flourWeight += r.flourWeight || 0;
        acc.oilRs += r.oilRs || 0;
        acc.oilWeight += r.oilWeight || 0;
        acc.khariRs += r.khariRs || 0;
        acc.khariWeight += r.khariWeight || 0;

        acc.totalDebit += r.totalDebit || 0;
        acc.sarsoRs += r.sarsoRs || 0;
        acc.sarsoWeight += r.sarsoWeight || 0;
        acc.gehumRs += r.gehumRs || 0;
        acc.gehumWeight += r.gehumWeight || 0;

        acc.staff1Rs += r.staff1Rs || 0;
        acc.staff2Rs += r.staff2Rs || 0;
        acc.millDebit += r.millDebit || 0;
        acc.homeDebit += r.homeDebit || 0;

        return acc;
      },
      {
        totalCredit: 0,
        millCredit: 0,
        flourRs: 0,
        flourWeight: 0,
        oilRs: 0,
        oilWeight: 0,
        khariRs: 0,
        khariWeight: 0,
        totalDebit: 0,
        sarsoRs: 0,
        sarsoWeight: 0,
        gehumRs: 0,
        gehumWeight: 0,
        staff1Rs: 0,
        staff2Rs: 0,
        millDebit: 0,
        homeDebit: 0,
      }
    );
  }, [filteredRows]);

  const netTotal = totals ? totals.totalCredit - totals.totalDebit : 0;

  // Base table cell & header styles
  const baseCell = "py-2.5 px-3 text-xs tabular-nums border-b border-border/50 dark:border-white/[0.06]";
  const headSticky =
    "sticky top-0 z-20 py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-foreground/80 bg-[#f4f1ec] dark:bg-[#1a1b1d] border-b-2 border-border/80 dark:border-white/15 whitespace-nowrap shadow-xs";

  return (
    <div className="relative w-full max-h-[72vh] overflow-auto rounded-xl border border-border/80 dark:border-white/10 bg-card shadow-sm scrollbar-thin scrollbar-thumb-muted/40">
      {/* Direct table element (no intermediate wrapper div) ensures 100% reliable sticky headers */}
      <table className="w-full min-w-max border-separate border-spacing-0 caption-bottom text-sm">
        <TableHeader className="sticky top-0 z-20">
          <TableRow className="border-none hover:bg-transparent">
            {/* ONLY # is sticky on the left AND sticky at the top */}
            <TableHead
              className={cn(
                headSticky,
                "sticky top-0 left-0 z-30 w-12 text-center bg-[#eae6e0] dark:bg-[#161718] border-r border-border/70 dark:border-white/15 shadow-[2px_0_5px_rgba(0,0,0,0.06)]"
              )}
            >
              #
            </TableHead>

            {/* Date: sticky top only, scrolls horizontally with table */}
            <TableHead className={cn(headSticky, "min-w-[135px] text-left")}>
              Date
            </TableHead>

            {/* Credits Group (Sticky Top) */}
            <TableHead
              className={cn(
                headSticky,
                "text-right font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/[0.08] dark:bg-emerald-500/15"
              )}
            >
              Total Cr
            </TableHead>
            <TableHead className={cn(headSticky, "text-right")}>Mill Cr</TableHead>
            <TableHead className={cn(headSticky, "text-right min-w-[100px]")}>Flour (Atta)</TableHead>
            <TableHead className={cn(headSticky, "text-right min-w-[100px]")}>Mustard Oil</TableHead>
            <TableHead className={cn(headSticky, "text-right min-w-[100px] border-r border-border/60 dark:border-white/10")}>
              Khari Cake
            </TableHead>

            {/* Debits Group (Sticky Top) */}
            <TableHead
              className={cn(
                headSticky,
                "text-right font-extrabold text-amber-700 dark:text-amber-400 bg-amber-500/[0.08] dark:bg-amber-500/15"
              )}
            >
              Total Dr
            </TableHead>
            <TableHead className={cn(headSticky, "text-right min-w-[100px]")}>Sarso (Seed)</TableHead>
            <TableHead className={cn(headSticky, "text-right min-w-[100px] border-r border-border/60 dark:border-white/10")}>
              Gehum (Wheat)
            </TableHead>

            {/* Operations Group (Sticky Top) */}
            <TableHead className={cn(headSticky, "text-right")}>Bhim</TableHead>
            <TableHead className={cn(headSticky, "text-right")}>Viswa</TableHead>
            <TableHead className={cn(headSticky, "text-left min-w-[120px]")}>Staff Desc</TableHead>
            <TableHead className={cn(headSticky, "text-right")}>Mill Dr</TableHead>
            <TableHead className={cn(headSticky, "text-left min-w-[120px]")}>Mill Desc</TableHead>
            <TableHead className={cn(headSticky, "text-right")}>Home Dr</TableHead>
            <TableHead className={cn(headSticky, "text-left min-w-[120px] border-r border-border/60 dark:border-white/10")}>
              Home Desc
            </TableHead>

            {/* Net: sticky top only, scrolls horizontally with table */}
            <TableHead
              className={cn(
                headSticky,
                "text-right min-w-[110px] font-extrabold text-primary bg-primary/[0.1] dark:bg-primary/20"
              )}
            >
              Net Daily
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* ================= TABLE BODY ================= */}
        <TableBody>
          {loading || isPending ? (
            <TableSkelton />
          ) : filteredRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={18} className="h-64 text-center py-12">
                <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <div className="h-12 w-12 rounded-2xl bg-secondary/60 flex items-center justify-center border border-border/70">
                    <Search className="h-6 w-6 text-muted-foreground/70" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-foreground">No ledger records found</p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      No matching mill transactions found for the selected filter or search criteria.
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredRows.map((row, index) => {
              const net = row.totalCredit - row.totalDebit;

              return (
                <TableRow
                  key={row.id}
                  className="group hover:bg-primary/[0.04] dark:hover:bg-white/[0.03] transition-colors"
                >
                  {/* ONLY # is sticky on left */}
                  <TableCell
                    className={cn(
                      baseCell,
                      "sticky left-0 z-10 w-12 text-center font-mono font-medium text-muted-foreground/70 bg-card group-hover:bg-[#f8f5f1] dark:group-hover:bg-[#232527] border-r border-border/60 dark:border-white/10 shadow-[2px_0_5px_rgba(0,0,0,0.03)] transition-colors"
                    )}
                  >
                    {index + 1}
                  </TableCell>

                  {/* Date Button: NOT sticky, highly visible clickable amber/copper button */}
                  <TableCell className={cn(baseCell, "min-w-[135px]")}>
                    <Link
                      href={`/mill-data/edit/${row.id}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold font-mono bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                      title="Click to edit entry"
                    >
                      <span>{formateIndDate(row.date)}</span>
                    </Link>
                  </TableCell>

                  {/* Inflow Credits */}
                  <TableCell className={cn(baseCell, "text-right")}>
                    {renderMoneyCell(row.totalCredit, true, "font-bold text-emerald-700 dark:text-emerald-400")}
                  </TableCell>
                  <TableCell className={cn(baseCell, "text-right")}>
                    {renderMoneyCell(row.millCredit)}
                  </TableCell>
                  <TableCell className={cn(baseCell, "text-right")}>
                    {renderCommodityCell(row.flourWeight, row.flourRs)}
                  </TableCell>
                  <TableCell className={cn(baseCell, "text-right")}>
                    {renderCommodityCell(row.oilWeight, row.oilRs)}
                  </TableCell>
                  <TableCell className={cn(baseCell, "text-right border-r border-border/60 dark:border-white/10")}>
                    {renderCommodityCell(row.khariWeight, row.khariRs)}
                  </TableCell>

                  {/* Outflow Debits */}
                  <TableCell className={cn(baseCell, "text-right")}>
                    {renderMoneyCell(row.totalDebit, true, "font-bold text-amber-700 dark:text-amber-400")}
                  </TableCell>
                  <TableCell className={cn(baseCell, "text-right")}>
                    {renderCommodityCell(row.sarsoWeight, row.sarsoRs)}
                  </TableCell>
                  <TableCell className={cn(baseCell, "text-right border-r border-border/60 dark:border-white/10")}>
                    {renderCommodityCell(row.gehumWeight, row.gehumRs)}
                  </TableCell>

                  {/* Operations & Staff */}
                  <TableCell className={cn(baseCell, "text-right")}>
                    {renderMoneyCell(row.staff1Rs)}
                  </TableCell>
                  <TableCell className={cn(baseCell, "text-right")}>
                    {renderMoneyCell(row.staff2Rs)}
                  </TableCell>
                  <TableCell className={cn(baseCell, "text-left text-muted-foreground max-w-[130px] truncate")}>
                    <span title={row.staffDescription || undefined}>
                      {row.staffDescription || <span className="text-muted-foreground/40 select-none">—</span>}
                    </span>
                  </TableCell>
                  <TableCell className={cn(baseCell, "text-right")}>
                    {renderMoneyCell(row.millDebit)}
                  </TableCell>
                  <TableCell className={cn(baseCell, "text-left text-muted-foreground max-w-[130px] truncate")}>
                    <span title={row.millDescription || undefined}>
                      {row.millDescription || <span className="text-muted-foreground/40 select-none">—</span>}
                    </span>
                  </TableCell>
                  <TableCell className={cn(baseCell, "text-right")}>
                    {renderMoneyCell(row.homeDebit)}
                  </TableCell>
                  <TableCell className={cn(baseCell, "text-left text-muted-foreground max-w-[130px] truncate border-r border-border/60 dark:border-white/10")}>
                    <span title={row.homeDescription || undefined}>
                      {row.homeDescription || <span className="text-muted-foreground/40 select-none">—</span>}
                    </span>
                  </TableCell>

                  {/* Net Balance: NOT sticky */}
                  <TableCell className={cn(baseCell, "text-right")}>
                    {renderNetBadge(net)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>

        {/* ================= TABLE FOOTER TOTALS ================= */}
        {totals && filteredRows.length > 0 && (
          <TableFooter className="sticky bottom-0 z-20">
            <TableRow className="border-none hover:bg-transparent">
              {/* Sticky # at bottom-left */}
              <TableCell
                className={cn(
                  baseCell,
                  "sticky bottom-0 left-0 z-30 text-center font-mono font-bold text-muted-foreground bg-[#eae6e0] dark:bg-[#161718] border-t-2 border-r border-border/80 dark:border-white/15 shadow-[2px_0_5px_rgba(0,0,0,0.06)]"
                )}
              >
                <FileSpreadsheet className="h-3.5 w-3.5 mx-auto text-primary" />
              </TableCell>

              {/* Totals Label: sticky bottom only */}
              <TableCell
                className={cn(
                  baseCell,
                  "sticky bottom-0 z-20 font-bold uppercase tracking-wider text-foreground text-[11px] bg-[#f4f1ec] dark:bg-[#1a1b1d] border-t-2 border-border/80 dark:border-white/15"
                )}
              >
                Totals ({filteredRows.length})
              </TableCell>

              {/* Credits Totals (Sticky Bottom) */}
              <TableCell className={cn(baseCell, "sticky bottom-0 z-20 text-right bg-[#f4f1ec] dark:bg-[#1a1b1d] border-t-2 border-border/80 dark:border-white/15")}>
                <span className="font-mono font-extrabold text-xs text-emerald-700 dark:text-emerald-400">
                  ₹{formatRs(totals.totalCredit)}
                </span>
              </TableCell>
              <TableCell className={cn(baseCell, "sticky bottom-0 z-20 text-right bg-[#f4f1ec] dark:bg-[#1a1b1d] border-t-2 border-border/80 dark:border-white/15")}>
                {renderMoneyCell(totals.millCredit, true)}
              </TableCell>
              <TableCell className={cn(baseCell, "sticky bottom-0 z-20 text-right bg-[#f4f1ec] dark:bg-[#1a1b1d] border-t-2 border-border/80 dark:border-white/15")}>
                {renderCommodityCell(totals.flourWeight, totals.flourRs)}
              </TableCell>
              <TableCell className={cn(baseCell, "sticky bottom-0 z-20 text-right bg-[#f4f1ec] dark:bg-[#1a1b1d] border-t-2 border-border/80 dark:border-white/15")}>
                {renderCommodityCell(totals.oilWeight, totals.oilRs)}
              </TableCell>
              <TableCell className={cn(baseCell, "sticky bottom-0 z-20 text-right border-r border-border/60 dark:border-white/10 bg-[#f4f1ec] dark:bg-[#1a1b1d] border-t-2 border-border/80 dark:border-white/15")}>
                {renderCommodityCell(totals.khariWeight, totals.khariRs)}
              </TableCell>

              {/* Debits Totals (Sticky Bottom) */}
              <TableCell className={cn(baseCell, "sticky bottom-0 z-20 text-right bg-[#f4f1ec] dark:bg-[#1a1b1d] border-t-2 border-border/80 dark:border-white/15")}>
                <span className="font-mono font-extrabold text-xs text-amber-700 dark:text-amber-400">
                  ₹{formatRs(totals.totalDebit)}
                </span>
              </TableCell>
              <TableCell className={cn(baseCell, "sticky bottom-0 z-20 text-right bg-[#f4f1ec] dark:bg-[#1a1b1d] border-t-2 border-border/80 dark:border-white/15")}>
                {renderCommodityCell(totals.sarsoWeight, totals.sarsoRs)}
              </TableCell>
              <TableCell className={cn(baseCell, "sticky bottom-0 z-20 text-right border-r border-border/60 dark:border-white/10 bg-[#f4f1ec] dark:bg-[#1a1b1d] border-t-2 border-border/80 dark:border-white/15")}>
                {renderCommodityCell(totals.gehumWeight, totals.gehumRs)}
              </TableCell>

              {/* Operations Totals (Sticky Bottom) */}
              <TableCell className={cn(baseCell, "sticky bottom-0 z-20 text-right bg-[#f4f1ec] dark:bg-[#1a1b1d] border-t-2 border-border/80 dark:border-white/15")}>
                {renderMoneyCell(totals.staff1Rs, true)}
              </TableCell>
              <TableCell className={cn(baseCell, "sticky bottom-0 z-20 text-right bg-[#f4f1ec] dark:bg-[#1a1b1d] border-t-2 border-border/80 dark:border-white/15")}>
                {renderMoneyCell(totals.staff2Rs, true)}
              </TableCell>
              <TableCell className={cn(baseCell, "sticky bottom-0 z-20 text-muted-foreground/40 text-center select-none bg-[#f4f1ec] dark:bg-[#1a1b1d] border-t-2 border-border/80 dark:border-white/15")}>
                —
              </TableCell>
              <TableCell className={cn(baseCell, "sticky bottom-0 z-20 text-right bg-[#f4f1ec] dark:bg-[#1a1b1d] border-t-2 border-border/80 dark:border-white/15")}>
                {renderMoneyCell(totals.millDebit, true)}
              </TableCell>
              <TableCell className={cn(baseCell, "sticky bottom-0 z-20 text-muted-foreground/40 text-center select-none bg-[#f4f1ec] dark:bg-[#1a1b1d] border-t-2 border-border/80 dark:border-white/15")}>
                —
              </TableCell>
              <TableCell className={cn(baseCell, "sticky bottom-0 z-20 text-right bg-[#f4f1ec] dark:bg-[#1a1b1d] border-t-2 border-border/80 dark:border-white/15")}>
                {renderMoneyCell(totals.homeDebit, true)}
              </TableCell>
              <TableCell className={cn(baseCell, "sticky bottom-0 z-20 text-muted-foreground/40 text-center select-none border-r border-border/60 dark:border-white/10 bg-[#f4f1ec] dark:bg-[#1a1b1d] border-t-2 border-border/80 dark:border-white/15")}>
                —
              </TableCell>

              {/* Net Total: sticky bottom only (NOT sticky right) */}
              <TableCell className={cn(baseCell, "sticky bottom-0 z-20 text-right bg-[#f4f1ec] dark:bg-[#1a1b1d] border-t-2 border-border/80 dark:border-white/15")}>
                {renderNetBadge(netTotal)}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </table>
    </div>
  );
};

export default TableComponent;
