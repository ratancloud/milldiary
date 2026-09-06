"use client";

import React from "react";
import { formatRs } from "@/lib/helper";
import { PiggyBank, Wallet } from "lucide-react";
import StatCard from "./StatCard";
import StatItem from "./StatItem";

interface IncomeSavingCardProps {
  income: number;
  saving: number;
  isLoading?: boolean;
  isSensitive?: boolean;
}

const IncomeSavingCard: React.FC<IncomeSavingCardProps> = ({
  income,
  saving,
  isLoading = false,
  isSensitive = false,
}) => {
  return (
    <StatCard
      icon={PiggyBank}
      label="Overall"
      headerValue={formatRs(saving)}
      variant="blue"
      isLoading={isLoading}
      isSensitive={isSensitive}
      skeletonCount={2}
    >
      <StatItem
        label="Income"
        value={income}
        icon={Wallet}
        variant="purple"
        isSensitive={isSensitive}
      />
      <StatItem
        label="Saving"
        value={saving}
        icon={PiggyBank}
        variant="blue"
        isSensitive={isSensitive}
      />
    </StatCard>
  );
};

export default IncomeSavingCard;
