import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import z from "zod";
import { apiResponseError, apiResponseSuccess } from "@/lib/api-response";
import { calculateTotals } from "@/lib/helper";
import { createMillDataValidator } from "@/lib/validators/millDataApi";


// GET: api/mill-data -> get all data for month
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
    const { searchParams } = new URL(req.url);
    const year = Number(searchParams.get("year"));
    const month = Number(searchParams.get("month"));

    if (!year || !month || month < 1 || month > 12) {
      return apiResponseError("Valid year and month are required", 400);
    }

    /* ---------- Date Range (UTC safe) ---------- */
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));

    /* ---------- Fetch Mill Data & Grinding Ledger Aggregation in Parallel ---------- */
    const [millData, grindingGroupStats] = await Promise.all([
      prisma.millData.findMany({
        where: {
          userId: session.user.id,
          date: {
            gte: start,
            lt: end,
          },
        },
        orderBy: { date: "asc" },
      }),
      prisma.grindingLedger.groupBy({
        by: ["commodityType"],
        where: {
          userId: session.user.id,
          date: {
            gte: start,
            lt: end,
          },
        },
        _sum: {
          weight: true,
        },
        _count: {
          id: true,
        },
      }),
    ]);

    /* ---------- Grinding Stats Calculation (High performance, O(1) in Node.js) ---------- */
    let wheatWeight = 0;
    let sarsoWeight = 0;
    let wheatRecords = 0;
    let sarsoRecords = 0;

    for (const group of grindingGroupStats) {
      const weight = Number(group._sum?.weight ?? 0);
      const count = Number(group._count?.id ?? 0);
      if (group.commodityType === "WHEAT") {
        wheatWeight = weight;
        wheatRecords = count;
      } else if (group.commodityType === "MUSTARD") {
        sarsoWeight = weight;
        sarsoRecords = count;
      }
    }

    const wheatRate = 3;
    const sarsoRate = 5;
    const wheatMoney = Number((wheatWeight * wheatRate).toFixed(0));
    const sarsoMoney = Number((sarsoWeight * sarsoRate).toFixed(0));
    const totalWeight = Number((wheatWeight + sarsoWeight).toFixed(0));
    const totalMoney = Number((wheatMoney + sarsoMoney).toFixed(0));
    const totalRecords = wheatRecords + sarsoRecords;

    const grindingStats = {
      totalWeight,
      wheatWeight: Number(wheatWeight.toFixed(0)),
      sarsoWeight: Number(sarsoWeight.toFixed(0)),
      wheatMoney,
      sarsoMoney,
      totalMoney,
      totalRecords,
      wheatRecords,
      sarsoRecords,
    };

    /* ---------- Totals ---------- */
    const totals = calculateTotals(millData);

    return apiResponseSuccess({
      items: millData,
      totals,
      grindingStats,
    });
  } catch (error) {
    console.error("GET /mill-data error:", error);
    return apiResponseError("Internal Server Error", 500);
  }
}

// POST: api/mill-data -> create new entry
export async function POST(req: Request) {
  try {
    /* ---------- Auth ---------- */
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return apiResponseError("Unauthorized", 401);
    }

    /* ---------- Body ---------- */
    const json = await req.json();
    const body = createMillDataValidator.parse(json);

    /* ---------- Prevent duplicate date ---------- */
    const existing = await prisma.millData.findFirst({
      where: {
        date: body.date,
        userId: session.user.id,
      },
    });

    if (existing) {
      return apiResponseError("Record already exists for this date", 409);
    }

    /* ---------- Totals ---------- */
    const totalCredit =
      body.millCredit + body.flourRs + body.oilRs + body.khariRs;

    const totalDebit =
      body.sarsoRs +
      body.gehumRs +
      body.staff1Rs +
      body.staff2Rs +
      body.millDebit +
      body.homeDebit;

    /* ---------- Create ---------- */
    const createdEntry = await prisma.millData.create({
      data: {
        ...body,
        userId: session.user.id,
        totalCredit,
        totalDebit,
      },
    });

    return apiResponseSuccess(createdEntry, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiResponseError("Validation failed", 400, z.treeifyError(error));
    }

    console.error("POST /mill-data error:", error);
    return apiResponseError("Internal Server Error", 500);
  }
}
