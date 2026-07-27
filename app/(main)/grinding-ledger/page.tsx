import React, { Suspense } from "react";
import type { Metadata } from "next";
import GrindingLedgerClient from "./GrindingLedgerClient";
import GrindingLedgerPageSkeleton from "@/components/skelton/GrindingLedgerPageSkeleton";

export const metadata: Metadata = {
  title: "Grinding Mill Ledger | Mill Diary",
  description: "Manage daily grinding registers, track wheat and mustard milling, and convert handwritten sheets using AI OCR.",
};

export default function GrindingLedgerPage() {
  return (
    <Suspense fallback={<GrindingLedgerPageSkeleton />}>
      <GrindingLedgerClient />
    </Suspense>
  );
}
