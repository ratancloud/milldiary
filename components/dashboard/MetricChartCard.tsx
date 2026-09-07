"use client";

import React, { useMemo, useState, useEffect } from "react";
import { LucideIcon, Scale, Calendar, TrendingUp } from "lucide-react";
import { useTheme } from "next-themes";
import {
  MonthlyHomeDebit,
  MonthlyMillCredit,
  MonthlyMillDebit,
} from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatRs, formatKg } from "@/lib/helper";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

type ChartDataPoint = MonthlyMillCredit | MonthlyMillDebit | MonthlyHomeDebit;

interface MetricChartCardProps<T extends ChartDataPoint> {
  title: string;
  icon: LucideIcon;
  data: T[];
  dataKey: keyof T & string;
  color: string;
  unit?: string;
  isSensitive?: boolean;
}

const WEIGHT_MAP: Partial<
  Record<string, keyof MonthlyMillCredit | keyof MonthlyMillDebit>
> = {
  flourRs: "flourWeight",
  oilRs: "oilWeight",
  khariRs: "khariWeight",
  gehumRs: "gehumWeight",
  sarsoRs: "sarsoWeight",
};

/**
 * Calibrated dark-mode palette adaptations.
 * Elevates mid-tone and dark-tone earth colors to maintain optimal luminance
 * and WCAG contrast against the dark mineral slate surface (#2c2e2f / #232526).
 */
const DARK_MODE_PALETTE: Record<string, string> = {
  "#357899": "#4ea8d1", // Flour Atta (Slate Blue -> Radiant Sky Slate)
  "#e09b43": "#f5ad52", // Mustard Oil (Amber -> Luminous Honey Gold)
  "#a6532e": "#d6875f", // Khari Cake (Copper -> Warm Radiance Copper)
  "#22a06b": "#34c785", // Total Mill Credit (Sage -> Mint Emerald)
  "#c9822b": "#e59f4e", // Wheat Gehum (Bronze -> Warm Harvest Gold)
  "#d4973b": "#f2b74b", // Mustard Sarso (Gold -> Bright Mustard)
  "#9e5238": "#d47b59", // Bhim Staff (Rust -> Terracotta)
  "#6e473b": "#b87563", // Viswa Staff (Deep Terracotta -> Desert Clay)
  "#766d66": "#aba49d", // Mill Debit (Mineral Slate -> High Contrast Slate)
  "#c94040": "#e55a5a", // Loss / Household (Red -> Coral Crimson)
};

export const MetricChartCard = <T extends ChartDataPoint>({
  title,
  icon: Icon,
  data,
  dataKey,
  color,
  unit = "₹",
  isSensitive = false,
}: MetricChartCardProps<T>) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Resolve color dynamically based on light/dark mode
  const resolvedColor = useMemo(() => {
    if (isDark && DARK_MODE_PALETTE[color]) {
      return DARK_MODE_PALETTE[color];
    }
    return color;
  }, [color, isDark]);

  // Aggregate annual total
  const totalValue = useMemo(() => {
    return data.reduce((acc, curr) => {
      const val = Number(curr[dataKey] || 0);
      return acc + val;
    }, 0);
  }, [data, dataKey]);

  // Aggregate commodity weight in Kg (if mapped)
  const totalWeight = useMemo(() => {
    const weightKey = WEIGHT_MAP[dataKey];
    if (!weightKey) return null;
    return data.reduce((acc, curr) => {
      return acc + Number((curr as any)[weightKey] || 0);
    }, 0);
  }, [data, dataKey]);

  // Active operating months & monthly average
  const { avgMonthly, peakMonth } = useMemo(() => {
    if (!data.length) return { avgMonthly: 0, peakMonth: null };

    const activeMonths = data.filter((d) => Number(d[dataKey] || 0) > 0);
    const divisor = activeMonths.length || data.length || 1;
    const avg = Math.round(totalValue / divisor);

    let peak: { monthLabel: string; value: number } | null = null;
    let maxVal = 0;
    for (const d of data) {
      const v = Number(d[dataKey] || 0);
      if (v > maxVal) {
        maxVal = v;
        peak = { monthLabel: (d as any).monthLabel || "", value: v };
      }
    }

    return { avgMonthly: avg, peakMonth: peak };
  }, [data, dataKey, totalValue]);

  const hasData = totalValue > 0;

  return (
    <Card
      className="flex flex-col h-full rounded-2xl border border-border/80 dark:border-white/10 bg-card text-card-foreground shadow-[var(--card-shadow)] hover:shadow-[var(--card-hover-shadow)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 overflow-hidden group"
    >
      {/* Seamless Single-Surface Header */}
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 sm:p-5 pb-1 sm:pb-2">
        <div className="space-y-1.5 min-w-0 flex-1 pr-3">
          <div className="flex items-center gap-2 flex-wrap">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
              {title}
            </CardTitle>
            {totalWeight !== null && totalWeight > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-secondary/80 dark:bg-secondary/50 text-secondary-foreground border border-border/70 dark:border-white/10">
                <Scale className="h-3 w-3 text-muted-foreground shrink-0" />
                {formatKg(totalWeight)} Kg
              </span>
            )}
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-foreground flex items-baseline gap-1">
            {unit === "₹" && (
              <span className="text-xs sm:text-sm font-sans font-medium opacity-65">₹</span>
            )}
            <span>
              {isSensitive && unit === "₹"
                ? "••••••"
                : unit === "₹"
                  ? formatRs(totalValue)
                  : `${totalValue.toLocaleString("en-IN")} ${unit}`}
            </span>
          </div>

          {/* Micro Telemetry Stat Line */}
          {hasData && (
            <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground font-medium flex-wrap pt-0.5">
              <span>
                Avg:{" "}
                <strong className="font-mono text-foreground font-semibold">
                  {unit === "₹"
                    ? isSensitive
                      ? "₹•••••"
                      : `₹${formatRs(avgMonthly)}`
                    : `${avgMonthly} ${unit}`}
                </strong>
                /mo
              </span>
              {peakMonth && peakMonth.value > 0 && (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  • Peak: <strong className="text-foreground font-semibold">{peakMonth.monthLabel}</strong>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Cohesive Tone-on-Tone Responsive Icon Squircle */}
        <div
          className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-105"
          style={{
            backgroundColor: isDark ? `${resolvedColor}24` : `${resolvedColor}14`,
            borderColor: isDark ? `${resolvedColor}40` : `${resolvedColor}28`,
            color: resolvedColor,
            boxShadow: isDark
              ? `0 2px 12px ${resolvedColor}22`
              : `0 2px 8px ${resolvedColor}15`,
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>

      {/* Chart Canvas Area */}
      <CardContent className="flex-1 p-4 sm:p-5 pt-2">
        {!hasData ? (
          <div className="h-44 sm:h-48 w-full flex flex-col items-center justify-center border border-dashed border-border/60 dark:border-white/10 rounded-xl bg-muted/20 text-center p-4">
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center mb-2 shrink-0 border"
              style={{
                backgroundColor: isDark ? `${resolvedColor}20` : `${resolvedColor}12`,
                borderColor: isDark ? `${resolvedColor}35` : `${resolvedColor}22`,
                color: resolvedColor,
              }}
            >
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold text-foreground">No transactions recorded</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[240px]">
              Zero activity logged for this commodity in the selected fiscal period.
            </p>
          </div>
        ) : (
          <div className="h-44 sm:h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 8, bottom: 0, left: 2 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(39, 35, 32, 0.08)"}
                />
                <XAxis
                  dataKey="monthLabel"
                  axisLine={{ stroke: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(39, 35, 32, 0.1)" }}
                  tickLine={false}
                  tick={{
                    fill: isDark ? "#a19e99" : "#6a625b",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={4}
                  textAnchor="end"
                  tick={{
                    fill: isDark ? "#a19e99" : "#6a625b",
                    fontSize: 10,
                    fontWeight: 500,
                  }}
                  tickFormatter={(value) => {
                    if (isSensitive && unit === "₹") return "••••";
                    if (value >= 100000) return `${unit}${(value / 100000).toFixed(1)}L`;
                    if (value >= 1000) return `${unit}${Math.round(value / 1000)}k`;
                    return `${unit}${value}`;
                  }}
                  width={50}
                />
                <Tooltip
                  content={
                    <BreakdownTooltip
                      totalAnnualValue={totalValue}
                      unit={unit}
                      isDark={isDark}
                      isSensitive={isSensitive}
                    />
                  }
                  cursor={{
                    fill: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(39, 35, 32, 0.04)",
                    rx: 6,
                    ry: 6,
                  }}
                />
                <Bar
                  dataKey={dataKey}
                  fill={resolvedColor}
                  fillOpacity={isDark ? 0.95 : 0.92}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface BreakdownTooltipProps extends TooltipProps<ValueType, NameType> {
  totalAnnualValue: number;
  unit: string;
  isDark: boolean;
  isSensitive?: boolean;
}

const BreakdownTooltip = ({
  active,
  payload,
  label,
  totalAnnualValue,
  unit,
  isDark,
  isSensitive = false,
}: BreakdownTooltipProps) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    const dataKey = entry.dataKey as string;
    const weightKey = WEIGHT_MAP[dataKey];
    const originalData = entry.payload as any;

    const valueNum = Number(entry.value || 0);
    const weightValue = weightKey ? originalData[weightKey] : null;

    // Percentage contribution of this month to the annual total
    const sharePercent =
      totalAnnualValue > 0
        ? ((valueNum / totalAnnualValue) * 100).toFixed(1)
        : "0";

    const formattedAmount =
      unit === "₹"
        ? isSensitive
          ? "₹••••••"
          : `₹${formatRs(valueNum)}`
        : `${valueNum.toLocaleString("en-IN")} ${unit}`;

    return (
      <div className="rounded-xl border border-border/80 dark:border-white/15 bg-card/95 backdrop-blur-md px-3.5 py-2.5 text-xs text-card-foreground shadow-xl dark:shadow-[0_12px_36px_rgba(0,0,0,0.6)] animate-in fade-in-0 zoom-in-95 min-w-[210px]">
        {/* Month & Seasonal Share Header */}
        <div className="flex items-center justify-between border-b border-border/60 dark:border-white/10 pb-1.5 mb-2 gap-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="font-bold text-foreground">{label}</span>
          </div>
          {totalAnnualValue > 0 && (
            <span className="font-mono text-[10px] font-semibold text-primary px-1.5 py-0.5 rounded bg-primary/10 dark:bg-primary/20 shrink-0">
              {sharePercent}% of FY
            </span>
          )}
        </div>

        {/* Data Row */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="h-2.5 w-2.5 rounded-full ring-2 ring-background shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground capitalize font-medium truncate">
                {entry.name || dataKey}
              </span>
            </div>
            <span className="font-mono font-bold text-foreground shrink-0 text-sm">
              {formattedAmount}
            </span>
          </div>

          {weightValue !== null && weightValue !== undefined && Number(weightValue) > 0 && (
            <div className="flex items-center justify-between pl-4.5 pt-0.5 border-t border-border/40 dark:border-white/5 text-[11px]">
              <span className="text-muted-foreground">Volume Milled</span>
              <span className="font-mono font-bold text-foreground">
                {formatKg(Number(weightValue))} Kg
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};
