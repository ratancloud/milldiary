"use client";

import React, { useMemo } from "react";
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
} from "lucide-react";
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
import { MetricChartCard } from "./MetricChartCard";

interface DashboardChartsProps {
  creditData: MonthlyMillCredit[];
  debitMillData: MonthlyMillDebit[];
  debitHomeData: MonthlyHomeDebit[];
}

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
      <div className="rounded-lg border bg-popover/95 px-4 py-3 text-sm shadow-xl backdrop-blur-sm animate-in fade-in-0 zoom-in-95 min-w-50">
        <p className="mb-2 font-semibold text-foreground border-b border-border/50 pb-2">
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
                  className="h-2.5 w-2.5 rounded-full ring-2 ring-background"
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

      {/* --- Breakdown Tabs --- */}
      <Tabs defaultValue="income" className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Detailed Breakdown
          </h2>
          <TabsList className="grid w-full sm:w-100 grid-cols-2">
            <TabsTrigger value="income">Income Streams</TabsTrigger>
            <TabsTrigger value="expense">Expense Streams</TabsTrigger>
          </TabsList>
        </div>

        {/* --- INCOME TAB --- */}
        <TabsContent value="income" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <MetricChartCard
              title="Flour Revenue"
              icon={Wheat}
              data={creditData}
              dataKey="flourRs"
              color={CHART_COLORS.flour}
            />

            <MetricChartCard
              title="Oil Revenue"
              icon={Droplets}
              data={creditData}
              dataKey="oilRs"
              color={CHART_COLORS.oil}
            />

            <MetricChartCard
              title="Khari Revenue"
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
        <TabsContent value="expense" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <MetricChartCard
              title="Wheat Purchase"
              icon={ShoppingBasket}
              data={debitMillData}
              dataKey="gehumRs"
              color={CHART_COLORS.wheat}
            />

            <MetricChartCard
              title="Mustard Purchase"
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
              title="Bhim (Staff)"
              icon={Users}
              data={debitMillData}
              dataKey="staff1Cost"
              color={CHART_COLORS.bhim}
            />

            <MetricChartCard
              title="Viswa (Staff)"
              icon={Users}
              data={debitMillData}
              dataKey="staff2Cost"
              color={CHART_COLORS.viswa}
            />

            <MetricChartCard
              title="Home Debit"
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
