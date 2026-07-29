import React, { Suspense } from "react";
import NewGrindingLedgerClient from "./NewGrindingLedgerClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Grinding Ledger Entry | MillDiary",
  description: "Add a manual entry or upload handwritten register via AI OCR",
};

export default function NewGrindingLedgerPage() {
  return <NewGrindingLedgerClient />;
}
