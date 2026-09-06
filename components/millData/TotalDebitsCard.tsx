"use client";

import React from "react";
import { TrendingDown } from "lucide-react";
import { formatRs } from "@/lib/helper";
import StatCard from "./StatCard";
import StatItem from "./StatItem";

export interface DebitStatsData {
  totalDebit?: number;
  gehumRs?: number;
  tGehumRs?: number;
  gehumWeight?: number;
  tGehumWeight?: number;
  sarsoRs?: number;
  tSarsoRs?: number;
  sarsoWeight?: number;
  tSarsoWeight?: number;
  homeDebit?: number;
  tHomeDebit?: number;
  millDebit?: number;
  tMillDebit?: number;
  staff1Rs?: number;
  tStaff1Rs?: number;
  staff2Rs?: number;
  tStaff2Rs?: number;
}

export interface TotalDebitsCardProps {
  data?: DebitStatsData | null;
  isLoading?: boolean;
  isSensitive?: boolean;
}

export const TotalDebitsCard: React.FC<TotalDebitsCardProps> = ({
  data,
  isLoading = false,
  isSensitive = false,
}) => {
  const totalDebit = data?.totalDebit ?? 0;
  const gehumRs = data?.gehumRs ?? data?.tGehumRs ?? 0;
  const gehumWeight = data?.gehumWeight ?? data?.tGehumWeight ?? 0;
  const sarsoRs = data?.sarsoRs ?? data?.tSarsoRs ?? 0;
  const sarsoWeight = data?.sarsoWeight ?? data?.tSarsoWeight ?? 0;
  const homeDebit = data?.homeDebit ?? data?.tHomeDebit ?? 0;
  const millDebit = data?.millDebit ?? data?.tMillDebit ?? 0;
  const staff1Rs = data?.staff1Rs ?? data?.tStaff1Rs ?? 0;
  const staff2Rs = data?.staff2Rs ?? data?.tStaff2Rs ?? 0;

  return (
    <StatCard
      icon={TrendingDown}
      label="Total Debits"
      headerValue={formatRs(totalDebit)}
      variant="red"
      isLoading={isLoading}
      isSensitive={isSensitive}
    >
      <StatItem
        label="Gehum"
        value={gehumRs}
        sub={gehumWeight}
        variant="red"
        isSensitive={isSensitive}
      />
      <StatItem
        label="Sarso"
        value={sarsoRs}
        sub={sarsoWeight}
        variant="red"
        isSensitive={isSensitive}
      />
      <div className="grid md:grid-cols-2 gap-2">
        <StatItem
          label="Home"
          value={homeDebit}
          variant="red"
          isSensitive={isSensitive}
        />
        <StatItem
          label="Mill"
          value={millDebit}
          variant="red"
          isSensitive={isSensitive}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        <StatItem
          label="Bhim"
          value={staff1Rs}
          variant="red"
          isSensitive={isSensitive}
        />
        <StatItem
          label="Viswa"
          value={staff2Rs}
          variant="red"
          isSensitive={isSensitive}
        />
      </div>
    </StatCard>
  );
};

export default TotalDebitsCard;
