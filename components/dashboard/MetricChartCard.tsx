"use client";

import {
  MonthlyHomeDebit,
  MonthlyMillCredit,
  MonthlyMillDebit,
} from "@/types/dashboard";
import { LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatRs } from "@/lib/helper";
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

const AXIS_STYLE = {
  fontSize: 10,
  fill: "#888888",
};

export const MetricChartCard = <T extends ChartDataPoint>({
  title,
  icon: Icon,
  data,
  dataKey,
  color,
  unit = "₹",
}: MetricChartCardProps<T>) => {
  const totalValue = useMemo(() => {
    return data.reduce((acc, curr) => {
      const val = Number(curr[dataKey] || 0);
      return acc + val;
    }, 0);
  }, [data, dataKey]);

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/30">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="text-xl font-bold font-mono tracking-tight">
            {formatRs(totalValue)}
          </div>
        </div>
        <div className={`p-2 rounded-full bg-background border shadow-sm`}>
          <Icon className="h-4 w-4 text-primary" style={{ color: color }} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-4">
        <div className="h-45 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 5, bottom: 0, left: -25 }}
            >
              <defs>
                <linearGradient
                  id={`gradient-${dataKey}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="monthLabel"
                axisLine={false}
                tickLine={false}
                tick={AXIS_STYLE}
                padding={{ left: 10, right: 10 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={AXIS_STYLE}
                tickFormatter={(value) => `${unit}${value / 1000}k`}
              />
              <Tooltip
                content={<BreakdownTooltip />}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
              />
              <Bar
                dataKey={dataKey}
                fill={`url(#gradient-${dataKey})`}
                stroke={color}
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const BreakdownTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-popover/95 px-4 py-3 text-sm shadow-xl backdrop-blur-sm animate-in fade-in-0 zoom-in-95 min-w-55">
        <p className="mb-2 font-semibold text-foreground border-b border-border/50 pb-2">
          {label}
        </p>
        <div className="flex flex-col gap-2">
          {payload.map((entry, index) => {
            const dataKey = entry.dataKey as string;
            // Safe access using the partial record
            const weightKey = WEIGHT_MAP[dataKey];
            const originalData = entry.payload as any;

            const weightValue = weightKey ? originalData[weightKey] : null;
            const formattedAmount = formatRs(Number(entry.value));

            const displayValue =
              weightValue !== null &&
              weightValue !== undefined &&
              Number(weightValue) > 0
                ? `${formattedAmount} / ${Math.round(Number(weightValue))}kg`
                : formattedAmount;

            return (
              <div
                key={index}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full ring-2 ring-background"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-muted-foreground capitalize font-medium">
                    {entry.name}
                  </span>
                </div>
                <span className="font-mono font-bold text-foreground whitespace-nowrap">
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};
