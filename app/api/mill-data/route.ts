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

    /* ---------- Fetch ---------- */
    const millData = await prisma.millData.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: start,
          lt: end,
        },
      },
      orderBy: { date: "asc" },
    });

    /* ---------- Totals ---------- */
    const totals = calculateTotals(millData);

    return apiResponseSuccess({
      items: millData,
      totals,
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
