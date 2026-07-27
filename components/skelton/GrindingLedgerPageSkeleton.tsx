"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function GrindingLedgerPageSkeleton() {
  return (
    <div className="container max-w-7xl mx-auto p-3 sm:p-6 md:p-8 space-y-4 md:space-y-6">
      {/* ── Page Top Header Bar Skeleton ── */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-24 rounded-md shadow-sm" />
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-10 w-24 rounded-xl shadow-sm" />
          <Skeleton className="h-10 w-20 rounded-xl shadow-sm" />
        </div>
      </div>

      {/* ── Stats Card Skeleton ── */}
      <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-3.5 w-52 rounded-md" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
      </div>

      {/* ── Day Scroller Skeleton ── */}
      <div className="flex items-center gap-2 overflow-hidden py-1">
        <Skeleton className="h-14 w-12 rounded-xl shrink-0" />
        <div className="flex gap-2 flex-1 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-16 rounded-xl shrink-0" />
          ))}
        </div>
        <Skeleton className="h-14 w-12 rounded-xl shrink-0" />
      </div>

      {/* ── Toolbar Skeleton (Commodity Toggle + Search) ── */}
      <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Skeleton className="h-10 w-full sm:w-56 rounded-xl" />
        <Skeleton className="h-10 w-full sm:w-[280px] rounded-xl" />
      </div>

      {/* ── Table/Cards Skeleton ── */}
      <div className="space-y-4">
        {/* Desktop Table Skeleton */}
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

        {/* Mobile Cards Skeleton */}
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
    </div>
  );
}
