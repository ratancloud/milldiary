"use client";

import React from "react";
import IncomeSavingCard from "./IncomeSavingCard";
import GrindingStatsCard from "./GrindingStatsCard";
import TotalCreditsCard, { CreditStatsData } from "./TotalCreditsCard";
import TotalDebitsCard, { DebitStatsData } from "./TotalDebitsCard";
import { GrindingStat } from "@/types/mill-data";

export interface SummaryCardsProps {
  income: number;
  saving: number;
  grindingStats?: GrindingStat | null;
  data?: (CreditStatsData & DebitStatsData) | null;
  isLoading?: boolean;
  isSensitive?: boolean;
  className?: string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  income,
  saving,
  grindingStats,
  data,
  isLoading = false,
  isSensitive = false,
  className = "grid grid-cols-1 md:grid-cols-2 gap-6",
}) => {
  return (
    <div className={className}>
      {/* 1. Overall Income & Saving */}
      <IncomeSavingCard
        income={income}
        saving={saving}
        isLoading={isLoading}
        isSensitive={isSensitive}
      />

      {/* 2. Grinding Ledger */}
      <GrindingStatsCard
        stats={grindingStats}
        isLoading={isLoading}
        isSensitive={isSensitive}
      />

      {/* 3. Total Credits */}
      <TotalCreditsCard
        data={data}
        isLoading={isLoading}
        isSensitive={isSensitive}
      />

      {/* 4. Total Debits */}
      <TotalDebitsCard
        data={data}
        isLoading={isLoading}
        isSensitive={isSensitive}
      />
    </div>
  );
};

export default SummaryCards;
