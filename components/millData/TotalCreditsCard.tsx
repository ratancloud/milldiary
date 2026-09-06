"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { formatRs } from "@/lib/helper";
import StatCard from "./StatCard";
import StatItem from "./StatItem";

export interface CreditStatsData {
  totalCredit?: number;
  millCredit?: number;
  tMillCredit?: number;
  flourRs?: number;
  tFlourRs?: number;
  flourWeight?: number;
  tFlourWeight?: number;
  oilRs?: number;
  tOilRs?: number;
  oilWeight?: number;
  tOilWeight?: number;
  khariRs?: number;
  tKhariRs?: number;
  khariWeight?: number;
  tKhariWeight?: number;
}

export interface TotalCreditsCardProps {
  data?: CreditStatsData | null;
  isLoading?: boolean;
  isSensitive?: boolean;
}

export const TotalCreditsCard: React.FC<TotalCreditsCardProps> = ({
  data,
  isLoading = false,
  isSensitive = false,
}) => {
  const totalCredit = data?.totalCredit ?? 0;
  const millCredit = data?.millCredit ?? data?.tMillCredit ?? 0;
  const flourRs = data?.flourRs ?? data?.tFlourRs ?? 0;
  const flourWeight = data?.flourWeight ?? data?.tFlourWeight ?? 0;
  const oilRs = data?.oilRs ?? data?.tOilRs ?? 0;
  const oilWeight = data?.oilWeight ?? data?.tOilWeight ?? 0;
  const khariRs = data?.khariRs ?? data?.tKhariRs ?? 0;
  const khariWeight = data?.khariWeight ?? data?.tKhariWeight ?? 0;

  return (
    <StatCard
      icon={TrendingUp}
      label="Total Credits"
      headerValue={formatRs(totalCredit)}
      variant="green"
      isLoading={isLoading}
      isSensitive={isSensitive}
    >
      <StatItem
        label="Mill Credit"
        value={millCredit}
        variant="green"
        isSensitive={isSensitive}
      />
      <StatItem
        label="Flour"
        value={flourRs}
        sub={flourWeight}
        variant="green"
        isSensitive={isSensitive}
      />
      <StatItem
        label="Oil"
        value={oilRs}
        sub={oilWeight}
        variant="green"
        isSensitive={isSensitive}
      />
      <StatItem
        label="Khari"
        value={khariRs}
        sub={khariWeight}
        variant="green"
        isSensitive={isSensitive}
      />
    </StatCard>
  );
};

export default TotalCreditsCard;
