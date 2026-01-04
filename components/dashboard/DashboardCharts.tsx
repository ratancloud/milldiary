"use client";

import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
  Line,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MonthlyHomeDebit,
  MonthlyMillCredit,
  MonthlyMillDebit,
} from "@/types/dashboard";
import { formatRs } from "@/lib/helper";

interface DashboardChartsProps {
  creditData: MonthlyMillCredit[];
  debitMillData: MonthlyMillDebit[];
  debitHomeData: MonthlyHomeDebit[];
}

// --- Configuration & Constants ---

// Centralized color palette for easy tweaking
const CHART_COLORS = {
  flour: "#3b82f6", // blue-500
  oil: "#f59e0b", // amber-500
  khari: "#8b5cf6", // violet-500
  millCr: "#10b981", // emerald-500
  wheat: "#d97706", // amber-600
  mustard: "#eab308", // yellow-500
  bhim: "#ec4899", // pink-500
  viswa: "#be185d", // rose-700
  millDr: "#64748b", // slate-500
  incomeLine: "#2563eb", // blue-600
  lossBar: "#ef4444", // red-500
};

// Map "Money" keys to their corresponding "Weight" keys
const WEIGHT_MAP: Record<
  string,
  keyof MonthlyMillCredit | keyof MonthlyMillDebit
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

// --- 1. Overview Tooltip ---
const OverviewTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md animate-in fade-in-0 zoom-in-95 max-w-50">
        <p className="mb-2 font-semibold text-foreground border-b border-border pb-1">
          {label}
        </p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full ring-1 ring-inset ring-foreground/20"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground capitalize text-xs sm:text-sm">
                  {entry.name}
                </span>
              </div>
              <span className="font-mono font-medium text-foreground text-xs sm:text-sm">
                {formatRs(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// --- 2. Breakdown Tooltip ---
const BreakdownTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md animate-in fade-in-0 zoom-in-95 min-w-55">
        <p className="mb-2 font-semibold text-foreground border-b border-border pb-1">
          {label}
        </p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry: any, index: number) => {
            const dataKey = entry.dataKey as string;
            const weightKey = WEIGHT_MAP[dataKey];
            const weightValue = weightKey ? entry.payload[weightKey] : null;
            const formattedAmount = formatRs(entry.value);

            const displayValue =
              weightValue !== null &&
              weightValue !== undefined &&
              weightValue > 0
                ? `${formattedAmount}/${Math.round(weightValue)}kg`
                : formattedAmount;

            return (
              <div
                key={index}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full ring-1 ring-inset ring-foreground/20"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-muted-foreground capitalize text-xs sm:text-sm">
                    {entry.name}
                  </span>
                </div>
                <span className="font-mono font-medium text-foreground text-xs sm:text-sm whitespace-nowrap">
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

export const DashboardCharts = ({
  creditData,
  debitMillData,
  debitHomeData,
}: DashboardChartsProps) => {
  const overviewData = useMemo(() => {
    return creditData.map((creditItem) => {
      const debitItem = debitMillData.find((d) => d.month === creditItem.month);

      const totalCredit = creditItem.totalCredit;
      const MillDebit = debitItem?.totalMillDebit || 0;
      const Income = totalCredit - MillDebit;

      return {
        month: creditItem.monthLabel,
        Credit: totalCredit,
        MillDr: MillDebit,
        Income: Income,
      };
    });
  }, [creditData, debitMillData]);

  return (
    <div className="space-y-6">
      {/* --- Chart 1: Overview --- */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>Credit vs Debit with Income</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-75 sm:h-100 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={overviewData}
                margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient
                    id="creditGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS.millCr}
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS.millCr}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                  strokeOpacity={0.5}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_STYLE}
                  dy={10}
                  interval="preserveStartEnd"
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_STYLE}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                  width={40}
                />

                <Tooltip
                  content={<OverviewTooltip />}
                  cursor={{ fill: "hsl(var(--muted) / 0.2)" }}
                />

                {/* Fixed: Added color to Legend wrapperStyle for dark mode visibility */}
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
                  fill="url(#creditGradient)"
                  stroke={CHART_COLORS.millCr}
                  strokeWidth={2}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />

                <Bar
                  dataKey="MillDr"
                  fill={CHART_COLORS.lossBar}
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                  fillOpacity={0.9}
                />

                <Line
                  type="monotone"
                  dataKey="Income"
                  stroke={CHART_COLORS.incomeLine}
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: CHART_COLORS.incomeLine,
                    strokeWidth: 2,
                    stroke: "hsl(var(--background))", // Adaptive stroke for dots
                  }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="income" className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Detailed Breakdown
          </h2>
          <TabsList className="grid w-full sm:w-auto grid-cols-2">
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
          </TabsList>
        </div>

        {/* Income Content */}
        <TabsContent value="income" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Revenue</CardTitle>
              <CardDescription>Flour, Oil, Khari, Mill credits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-75 sm:h-87.5 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={creditData}
                    margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                      strokeOpacity={0.5}
                    />
                    <XAxis
                      dataKey="monthLabel"
                      axisLine={false}
                      tickLine={false}
                      tick={AXIS_STYLE}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={AXIS_STYLE}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                      width={40}
                    />
                    <Tooltip
                      content={<BreakdownTooltip />}
                      cursor={{ fill: "hsl(var(--muted) / 0.2)" }}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: "20px",
                        fontSize: "12px",
                        color: "hsl(var(--foreground))",
                      }}
                      iconType="circle"
                    />

                    <Bar
                      dataKey="flourRs"
                      name="Flour"
                      stackId="a"
                      fill={CHART_COLORS.flour}
                      radius={[0, 0, 4, 4]}
                    />
                    <Bar
                      dataKey="oilRs"
                      name="Oil"
                      stackId="a"
                      fill={CHART_COLORS.oil}
                    />
                    <Bar
                      dataKey="khariRs"
                      name="Khari"
                      stackId="a"
                      fill={CHART_COLORS.khari}
                    />
                    <Bar
                      dataKey="millCredit"
                      name="Mill Cr"
                      stackId="a"
                      fill={CHART_COLORS.millCr}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expense Content */}
        <TabsContent value="expense" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Expense</CardTitle>
              <CardDescription>
                Wheat, Mustard, Bhim, Viswa, Mill Debit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-75 sm:h-87.5 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={debitMillData}
                    margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                      strokeOpacity={0.5}
                    />
                    <XAxis
                      dataKey="monthLabel"
                      axisLine={false}
                      tickLine={false}
                      tick={AXIS_STYLE}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={AXIS_STYLE}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                      width={40}
                    />
                    <Tooltip
                      content={<BreakdownTooltip />}
                      cursor={{ fill: "hsl(var(--muted) / 0.2)" }}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: "20px",
                        fontSize: "12px",
                        color: "hsl(var(--foreground))",
                      }}
                      iconType="circle"
                    />

                    <Bar
                      dataKey="gehumRs"
                      name="Wheat"
                      stackId="a"
                      fill={CHART_COLORS.wheat}
                      radius={[0, 0, 4, 4]}
                    />
                    <Bar
                      dataKey="sarsoRs"
                      name="Mustard"
                      stackId="a"
                      fill={CHART_COLORS.mustard}
                    />
                    <Bar
                      dataKey="staff1Cost"
                      name="Bhim"
                      stackId="a"
                      fill={CHART_COLORS.bhim}
                    />
                    <Bar
                      dataKey="staff2Cost"
                      name="Viswa"
                      stackId="a"
                      fill={CHART_COLORS.viswa}
                    />
                    <Bar
                      dataKey="millDebit"
                      name="Mill Dr"
                      stackId="a"
                      fill={CHART_COLORS.millDr}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Home debit */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Home Debit</CardTitle>
          <CardDescription>Overview of home expense</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-75 sm:h-100 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={debitHomeData}
                margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
              >
                {/* Removed unused <defs> gradient to clean up code */}

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                  strokeOpacity={0.5}
                />

                <XAxis
                  dataKey="monthLabel"
                  axisLine={false}
                  tickLine={false}
                  // Applied the safe neutral color directly here
                  tick={{ fill: "#71717a", fontSize: 10 }}
                  dy={10}
                  interval="preserveStartEnd"
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  // Applied the safe neutral color directly here
                  tick={{ fill: "#71717a", fontSize: 10 }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                  width={40}
                />

                <Tooltip
                  content={<OverviewTooltip />}
                  cursor={{ fill: "hsl(var(--muted) / 0.2)" }}
                />

                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "12px",
                    color: "hsl(var(--foreground))",
                  }}
                  iconType="circle"
                />

                <Bar
                  dataKey="homeDebit"
                  name="Home Debit"
                  fill={CHART_COLORS.lossBar}
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                  fillOpacity={0.9}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
