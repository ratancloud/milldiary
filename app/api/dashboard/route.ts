import { apiResponseError, apiResponseSuccess } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  MonthlyHomeDebit,
  MonthlyMillCredit,
  MonthlyMillDebit,
  YearSummaryCard,
} from "@/types/dashboard";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

/* ---------------- Helper ---------------- */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const initMonth = (month: number) => ({
  month,
  monthLabel: MONTHS[month - 1],

  // credit
  millCredit: 0,
  flourRs: 0,
  flourWeight: 0,
  oilRs: 0,
  oilWeight: 0,
  khariRs: 0,
  khariWeight: 0,
  totalCredit: 0,

  // debit
  gehumRs: 0,
  gehumWeight: 0,
  sarsoRs: 0,
  sarsoWeight: 0,
  staff1Cost: 0,
  staff2Cost: 0,
  millDebit: 0,
  homeDebit: 0,
});

/* ---------------- API ---------------- */

export async function GET(req: NextRequest) {
  try {
    /* ---------- Auth ---------- */
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return apiResponseError("Unauthorized", 401);
    }

    /* ---------- Query Params ---------- */
    const year = Number(req.nextUrl.searchParams.get("year"));
    if (!year) {
      return apiResponseError("Valid year is required", 400);
    }

    /* ---------- Date Range (UTC safe) ---------- */
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year + 1, 0, 1));

    /* ---------- Fetch Data ---------- */
    const rows = await prisma.millData.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: start,
          lt: end,
        },
      },
    });

    /* ---------- Month Map ---------- */
    const monthMap = new Map<number, ReturnType<typeof initMonth>>();

    /* ---------- Year Totals ---------- */
    let totalCredit = 0;
    let totalDebit = 0;
    let tMillDebit = 0;
    let tHomeDebit = 0;

    let tMillCredit = 0;
    let tFlourWeight = 0;
    let tFlourRs = 0;
    let tOilWeight = 0;
    let tOilRs = 0;
    let tKhariWeight = 0;
    let tKhariRs = 0;

    let tSarsoWeight = 0;
    let tSarsoRs = 0;
    let tGehumWeight = 0;
    let tGehumRs = 0;
    let tStaff1Rs = 0;
    let tStaff2Rs = 0;

    /* ---------- Reduce Rows ---------- */
    for (const row of rows) {
      const month = row.date.getUTCMonth() + 1;
      if (!monthMap.has(month)) monthMap.set(month, initMonth(month));

      const m = monthMap.get(month)!;

      // Monthly Totals
      m.millCredit += row.millCredit;
      m.flourRs += row.flourRs;
      m.flourWeight += row.flourWeight;
      m.oilRs += row.oilRs;
      m.oilWeight += row.oilWeight;
      m.khariRs += row.khariRs;
      m.khariWeight += row.khariWeight;
      m.totalCredit += row.totalCredit;

      m.gehumRs += row.gehumRs;
      m.gehumWeight += row.gehumWeight;
      m.sarsoRs += row.sarsoRs;
      m.sarsoWeight += row.sarsoWeight;
      m.staff1Cost += row.staff1Rs;
      m.staff2Cost += row.staff2Rs;
      m.millDebit += row.millDebit;
      m.homeDebit += row.homeDebit;

      // Year Totals
      totalCredit += row.totalCredit;
      totalDebit += row.totalDebit;

      tMillCredit += row.millCredit;
      tFlourWeight += row.flourWeight;
      tFlourRs += row.flourRs;
      tOilWeight += row.oilWeight;
      tOilRs += row.oilRs;
      tKhariWeight += row.khariWeight;
      tKhariRs += row.khariRs;

      tSarsoWeight += row.sarsoWeight;
      tSarsoRs += row.sarsoRs;
      tGehumWeight += row.gehumWeight;
      tGehumRs += row.gehumRs;
      tStaff1Rs += row.staff1Rs;
      tStaff2Rs += row.staff2Rs;
      tMillDebit += row.millDebit;
      tHomeDebit += row.homeDebit;
    }

    // Monthly Arrays data
    const monthlyCredit: MonthlyMillCredit[] = [];
    const monthlyMillDebit: MonthlyMillDebit[] = [];
    const monthlyHomeDebit: MonthlyHomeDebit[] = [];

    for (let month = 1; month <= 12; month++) {
      const m = monthMap.get(month) ?? initMonth(month);

      monthlyCredit.push({
        month,
        monthLabel: m.monthLabel,
        millCredit: m.millCredit,
        flourRs: m.flourRs,
        flourWeight: m.flourWeight,
        oilRs: m.oilRs,
        oilWeight: m.oilWeight,
        khariRs: m.khariRs,
        khariWeight: m.khariWeight,
        totalCredit: m.totalCredit,
      });

      monthlyMillDebit.push({
        month,
        monthLabel: m.monthLabel,
        gehumRs: m.gehumRs,
        gehumWeight: m.gehumWeight,
        sarsoRs: m.sarsoRs,
        sarsoWeight: m.sarsoWeight,
        staff1Cost: m.staff1Cost,
        staff2Cost: m.staff2Cost,
        millDebit: m.millDebit,
        totalMillDebit:
          m.gehumRs + m.sarsoRs + m.staff1Cost + m.staff2Cost + m.millDebit,
      });

      monthlyHomeDebit.push({
        month,
        monthLabel: m.monthLabel,
        homeDebit: m.homeDebit,
      });
    }

    // yearly Summary
    const summary: YearSummaryCard = {
      year,
      totalCredit,
      totalDebit,

      tMillCredit,
      tFlourWeight,
      tFlourRs,
      tOilWeight,
      tOilRs,
      tKhariWeight,
      tKhariRs,

      tGehumWeight,
      tGehumRs,
      tSarsoWeight,
      tSarsoRs,
      tStaff1Rs,
      tStaff2Rs,
      tMillDebit,
      tHomeDebit,
      netIncome: totalCredit - (tGehumRs + tSarsoRs + tStaff1Rs + tStaff2Rs + tMillDebit),
      netSaving: totalCredit - totalDebit,
    };

    // Response 
    return apiResponseSuccess({
      summary,
      monthlyCredit,
      monthlyMillDebit,
      monthlyHomeDebit,
    });
  } catch (error) {
    console.error("[DASHBOARD_API_ERROR]", error);
    return apiResponseError("Internal Server Error", 500);
  }
}
