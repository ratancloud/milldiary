"use client";

import React from "react";
import { EMPTY_GRINDING_STAT, GrindingStat } from "@/types/mill-data";
import { formatRs } from "@/lib/helper";
import { Scale } from "lucide-react";
import StatCard from "./StatCard";
import StatItem from "./StatItem";

interface GrindingStatsCardProps {
  stats?: GrindingStat | null;
  isLoading?: boolean;
  isSensitive?: boolean;
}

const GrindingStatsCard: React.FC<GrindingStatsCardProps> = ({
  stats,
  isLoading = false,
  isSensitive = false,
}) => {
  const currentStats = stats ?? EMPTY_GRINDING_STAT;

  return (
    <StatCard
      icon={Scale}
      label="Grinding Ledger"
      headerValue={formatRs(currentStats.totalMoney)}
      variant="purple"
      isLoading={isLoading}
      isSensitive={isSensitive}
      gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-3"
      skeletonCount={2}
    >
      <StatItem
        label="Wheat"
        value={currentStats.wheatMoney}
        sub={currentStats.wheatWeight}
        badge={`${currentStats.wheatRecords} slips`}
        variant="amber"
        isSensitive={isSensitive}
      />
      <StatItem
        label="Sarso"
        value={currentStats.sarsoMoney}
        sub={currentStats.sarsoWeight}
        badge={`${currentStats.sarsoRecords} slips`}
        variant="green"
        isSensitive={isSensitive}
      />
    </StatCard>
  );
};

export default GrindingStatsCard;
