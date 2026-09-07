"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
  Line,
  Area,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import {
  Wheat,
  Droplets,
  Package,
  Building2,
  ShoppingBasket,
  Sprout,
  Users,
  Home,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MonthlyHomeDebit,
  MonthlyMillCredit,
  MonthlyMillDebit,
} from "@/types/dashboard";
import { formatRs } from "@/lib/helper";
import { MetricChartCard } from "./MetricChartCard";

interface DashboardChartsProps {
  creditData: MonthlyMillCredit[];
  debitMillData: MonthlyMillDebit[];
  debitHomeData: MonthlyHomeDebit[];
}

const CHART_COLORS = {
  flour: "#357899", // mineral slate blue
  oil: "#e09b43", // warm amber
  khari: "#a6532e", // copper accent
  millCr: "#22a06b", // sage green
  wheat: "#c9822b", // warm bronze
  mustard: "#d4973b", // mustard gold
  bhim: "#9e5238", // warm rust
  viswa: "#6e473b", // deep terracotta
  millDr: "#766d66", // mineral slate
  incomeLine: "#a6532e", // copper primary
  lossBar: "#c94040", // copper slate danger
} as const;

const AXIS_STYLE = {
  fontSize: 10,
  fill: "#888888",
};

const OverviewTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md px-4 py-3 text-xs shadow-2xl animate-in fade-in-0 zoom-in-95 min-w-56">
        <p className="font-bold text-foreground border-b border-border/50 pb-2 mb-2">
          {label}
        </p>
        <div className="flex flex-col gap-2">
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full ring-2 ring-background shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground capitalize font-medium">
                  {entry.name}
                </span>
              </div>
              <span className="font-mono font-bold text-foreground">
                {formatRs(Number(entry.value))}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardCharts = ({
  creditData,
  debitMillData,
  debitHomeData,
}: DashboardChartsProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const dynamicColors = useMemo(() => ({
    millCr: isDark ? "#34c785" : CHART_COLORS.millCr,
    lossBar: isDark ? "#e55a5a" : CHART_COLORS.lossBar,
    incomeLine: isDark ? "#d6875f" : CHART_COLORS.incomeLine,
  }), [isDark]);

  const axisTickStyle = useMemo(() => ({
    fontSize: 10,
    fontWeight: 500,
    fill: isDark ? "#a19e99" : "#6a625b",
  }), [isDark]);

  const overviewData = useMemo(() => {
    return creditData.map((creditItem) => {
      const debitItem = debitMillData.find((d) => d.month === creditItem.month);

      const totalCredit = Number(creditItem.totalCredit || 0);
      const MillDebit = Number(debitItem?.totalMillDebit || 0);
      const Income = totalCredit - MillDebit;

      return {
        month: creditItem.monthLabel,
        Credit: totalCredit,
        MillDr: MillDebit,
        Income: Income,
      };
    });
  }, [creditData, debitMillData]);

  // Peak month highlight
  const peakMonth = useMemo(() => {
    if (!overviewData.length) return null;
    return [...overviewData].sort((a, b) => b.Income - a.Income)[0];
  }, [overviewData]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* --- Chart 1: Financial Trajectory Overview --- */}
      <Card className="rounded-2xl border border-border/70 dark:border-white/[0.08] bg-card shadow-[var(--card-shadow)] overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <CardTitle className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                Financial Trajectory Overview
              </CardTitle>
              <Badge variant="accent" className="text-[10px] font-semibold">
                Cashflow vs Expenditure
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Comparative view of monthly credit inflows, operating mill debits, and net retained income
            </CardDescription>
          </div>

          {peakMonth && peakMonth.Income > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/70 dark:border-white/10 bg-secondary/50 text-xs shrink-0 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">Best Month:</span>
              <span className="font-bold text-foreground">{peakMonth.month}</span>
              <span className="font-mono font-bold text-primary">({formatRs(peakMonth.Income)})</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-5">
          <div className="h-72 sm:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={overviewData}
                margin={{ top: 15, right: 10, bottom: 0, left: 2 }}
              >
                <defs>
                  {/* Subtle Sage Gradient for Credit Area */}
                  <linearGradient
                    id="creditGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={dynamicColors.millCr}
                      stopOpacity={isDark ? 0.32 : 0.22}
                    />
                    <stop
                      offset="95%"
                      stopColor={dynamicColors.millCr}
                      stopOpacity={0}
                    />
                  </linearGradient>

                  {/* Copper Sheen for Income Line */}
                  <linearGradient
                    id="incomeGradient"
                    x1="0"
                    y1="0"
                    x2="100%"
                    y2="0"
                  >
                    <stop offset="0%" stopColor={isDark ? "#f0a27a" : "#c26338"} />
                    <stop offset="50%" stopColor={dynamicColors.incomeLine} />
                    <stop offset="100%" stopColor={isDark ? "#d6875f" : "#873e1c"} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(39, 35, 32, 0.08)"}
                />

                <XAxis
                  dataKey="month"
                  axisLine={{ stroke: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(39, 35, 32, 0.1)" }}
                  tickLine={false}
                  tick={axisTickStyle}
                  dy={10}
                  interval="preserveStartEnd"
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={4}
                  textAnchor="end"
                  tick={axisTickStyle}
                  tickFormatter={(val) => val >= 100000 ? `₹${(val / 100000).toFixed(1)}L` : val >= 1000 ? `₹${Math.round(val / 1000)}k` : `₹${val}`}
                  width={52}
                />

                <Tooltip
                  content={<OverviewTooltip />}
                  cursor={{ fill: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(39, 35, 32, 0.04)", rx: 6, ry: 6 }}
                />

                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "12px",
                    color: "hsl(var(--foreground))",
                  }}
                  iconType="circle"
                />

                <Area
                  type="monotone"
                  dataKey="Credit"
                  name="Gross Credit"
                  fill="url(#creditGradient)"
                  stroke={dynamicColors.millCr}
                  strokeWidth={2}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />

                <Bar
                  dataKey="MillDr"
                  name="Mill Debit"
                  fill={dynamicColors.lossBar}
                  radius={[5, 5, 0, 0]}
                  barSize={20}
                  fillOpacity={isDark ? 0.94 : 0.88}
                />

                <Line
                  type="monotone"
                  dataKey="Income"
                  name="Net Operating Income"
                  stroke={dynamicColors.incomeLine}
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: dynamicColors.incomeLine,
                    strokeWidth: 2,
                    stroke: "hsl(var(--background))",
                  }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* --- Section 2: Detailed Commodity Breakdown Tabs --- */}
      <Tabs defaultValue="income" className="w-full space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              Commodity & Operational Breakdown
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Granular inspection of individual milling revenue channels and processing expenditures
            </p>
          </div>

          <TabsList className="grid w-full sm:w-80 grid-cols-2 p-1 rounded-xl bg-secondary/60 border border-border/70">
            <TabsTrigger
              value="income"
              className="gap-1.5 rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xs transition-all cursor-pointer"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Income Streams</span>
            </TabsTrigger>
            <TabsTrigger
              value="expense"
              className="gap-1.5 rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xs transition-all cursor-pointer"
            >
              <ArrowDownRight className="h-3.5 w-3.5" />
              <span>Expense Streams</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --- INCOME TAB --- */}
        <TabsContent value="income" className="mt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <MetricChartCard
              title="Flour Revenue (Atta)"
              icon={Wheat}
              data={creditData}
              dataKey="flourRs"
              color={CHART_COLORS.flour}
            />

            <MetricChartCard
              title="Mustard Oil Revenue"
              icon={Droplets}
              data={creditData}
              dataKey="oilRs"
              color={CHART_COLORS.oil}
            />

            <MetricChartCard
              title="Khari / Cake Revenue"
              icon={Package}
              data={creditData}
              dataKey="khariRs"
              color={CHART_COLORS.khari}
            />

            <MetricChartCard
              title="Total Mill Credits"
              icon={Building2}
              data={creditData}
              dataKey="millCredit"
              color={CHART_COLORS.millCr}
            />
          </div>
        </TabsContent>

        {/* --- EXPENSE TAB --- */}
        <TabsContent value="expense" className="mt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <MetricChartCard
              title="Wheat Purchase (Gehum)"
              icon={ShoppingBasket}
              data={debitMillData}
              dataKey="gehumRs"
              color={CHART_COLORS.wheat}
            />

            <MetricChartCard
              title="Mustard Seed Purchase (Sarso)"
              icon={Sprout}
              data={debitMillData}
              dataKey="sarsoRs"
              color={CHART_COLORS.mustard}
            />

            <MetricChartCard
              title="Total Mill Debits"
              icon={Building2}
              data={debitMillData}
              dataKey="millDebit"
              color={CHART_COLORS.millDr}
            />

            <MetricChartCard
              title="Bhim (Operator Staff)"
              icon={Users}
              data={debitMillData}
              dataKey="staff1Cost"
              color={CHART_COLORS.bhim}
            />

            <MetricChartCard
              title="Viswa (Operator Staff)"
              icon={Users}
              data={debitMillData}
              dataKey="staff2Cost"
              color={CHART_COLORS.viswa}
            />

            <MetricChartCard
              title="Household Drawings (Home Debit)"
              icon={Home}
              data={debitHomeData}
              dataKey="homeDebit"
              color={CHART_COLORS.lossBar}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
