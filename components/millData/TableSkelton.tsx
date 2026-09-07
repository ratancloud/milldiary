import React from "react";
import { TableCell, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

const TableSkelton = () => {
  const baseCell = "py-2.5 px-3 border-b border-border/50 dark:border-white/[0.06]";

  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <TableRow key={i} className="hover:bg-transparent">
          {/* ONLY # is sticky on left */}
          <TableCell
            className={cn(
              baseCell,
              "sticky left-0 z-10 w-12 text-center bg-card border-r border-border/60 dark:border-white/10"
            )}
          >
            <Skeleton className="h-4 w-5 mx-auto rounded" />
          </TableCell>

          {/* Date: NOT sticky */}
          <TableCell className={cn(baseCell, "min-w-[130px]")}>
            <Skeleton className="h-6 w-24 rounded-lg" />
          </TableCell>

          {/* Credits Skeletons (5 cols) */}
          <TableCell className={cn(baseCell, "text-right")}>
            <Skeleton className="h-4 w-14 ml-auto rounded" />
          </TableCell>
          <TableCell className={cn(baseCell, "text-right")}>
            <Skeleton className="h-4 w-12 ml-auto rounded" />
          </TableCell>
          <TableCell className={cn(baseCell, "text-right min-w-[100px]")}>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-3.5 w-14 rounded" />
              <Skeleton className="h-2.5 w-10 rounded" />
            </div>
          </TableCell>
          <TableCell className={cn(baseCell, "text-right min-w-[100px]")}>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-3.5 w-14 rounded" />
              <Skeleton className="h-2.5 w-10 rounded" />
            </div>
          </TableCell>
          <TableCell className={cn(baseCell, "text-right min-w-[100px] border-r border-border/60 dark:border-white/10")}>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-3.5 w-14 rounded" />
              <Skeleton className="h-2.5 w-10 rounded" />
            </div>
          </TableCell>

          {/* Debits Skeletons (3 cols) */}
          <TableCell className={cn(baseCell, "text-right")}>
            <Skeleton className="h-4 w-14 ml-auto rounded" />
          </TableCell>
          <TableCell className={cn(baseCell, "text-right min-w-[100px]")}>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-3.5 w-14 rounded" />
              <Skeleton className="h-2.5 w-10 rounded" />
            </div>
          </TableCell>
          <TableCell className={cn(baseCell, "text-right min-w-[100px] border-r border-border/60 dark:border-white/10")}>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-3.5 w-14 rounded" />
              <Skeleton className="h-2.5 w-10 rounded" />
            </div>
          </TableCell>

          {/* Operations Skeletons (7 cols) */}
          <TableCell className={cn(baseCell, "text-right")}>
            <Skeleton className="h-4 w-10 ml-auto rounded" />
          </TableCell>
          <TableCell className={cn(baseCell, "text-right")}>
            <Skeleton className="h-4 w-10 ml-auto rounded" />
          </TableCell>
          <TableCell className={cn(baseCell, "text-left min-w-[120px]")}>
            <Skeleton className="h-3.5 w-20 rounded" />
          </TableCell>
          <TableCell className={cn(baseCell, "text-right")}>
            <Skeleton className="h-4 w-10 ml-auto rounded" />
          </TableCell>
          <TableCell className={cn(baseCell, "text-left min-w-[120px]")}>
            <Skeleton className="h-3.5 w-20 rounded" />
          </TableCell>
          <TableCell className={cn(baseCell, "text-right")}>
            <Skeleton className="h-4 w-10 ml-auto rounded" />
          </TableCell>
          <TableCell className={cn(baseCell, "text-left min-w-[120px] border-r border-border/60 dark:border-white/10")}>
            <Skeleton className="h-3.5 w-20 rounded" />
          </TableCell>

          {/* Net: NOT sticky */}
          <TableCell className={cn(baseCell, "text-right min-w-[110px]")}>
            <Skeleton className="h-5 w-16 ml-auto rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default TableSkelton;
