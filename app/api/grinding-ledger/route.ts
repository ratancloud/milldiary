import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import z from "zod";
import { apiResponseError, apiResponseSuccess } from "@/lib/api-response";
import { calculateGrindingLedgerStats } from "@/lib/helper";
import {
  createGrindingLedgerValidator,
  insertManyGrindingLedgerValidator,
} from "@/lib/validators/grindingLedgerApi";
import { Prisma } from "@/generated/prisma/client";

// GET: api/grinding-ledger -> get records with filters and statistics
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return apiResponseError("Unauthorized", 401);
    }

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");
    const commodityType = searchParams.get("commodityType");

    const where: Prisma.GrindingLedgerWhereInput = {
      userId: session.user.id,
    };

    if (!dateStr || !commodityType) {
      return apiResponseError("Date and commodity type parameters are required", 400);
    }

    where.date = new Date(dateStr);

    if (commodityType && commodityType !== "ALL" && (commodityType === "WHEAT" || commodityType === "MUSTARD")) {
      where.commodityType = commodityType;
    }

    const items = await prisma.grindingLedger.findMany({
      where,
      orderBy: [
        { date: "desc" },
        { commodityType: "asc" },
        { serialNo: "asc" },
      ],
    });

    const stats = calculateGrindingLedgerStats(items);

    return apiResponseSuccess({
      items,
      stats,
    });
  } catch (error) {
    console.error("GET /grinding-ledger error:", error);
    return apiResponseError("Internal Server Error", 500);
  }
}

// POST: api/grinding-ledger -> create single record OR insert many records
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return apiResponseError("Unauthorized", 401);
    }

    const json = await req.json();

    // Check if it's bulk insert many
    if (Array.isArray(json.records)) {
      const body = insertManyGrindingLedgerValidator.parse(json);

      const recordsToCreate = body.records.map((r) => ({
        userId: session.user.id,
        date: body.date,
        commodityType: body.commodityType,
        serialNo: r.serialNo,
        customerNameEn: r.customerNameEn,
        customerNameHi: r.customerNameHi,
        villageEn: r.villageEn,
        villageHi: r.villageHi,
        weight: r.weight,
      }));

      const result = await prisma.grindingLedger.createMany({
        data: recordsToCreate,
        skipDuplicates: true,
      });

      return apiResponseSuccess(
        {
          count: result.count,
          message: `Successfully inserted ${result.count} records`,
        },
        201
      );
    }

    // Single create
    const body = createGrindingLedgerValidator.parse(json);

    const existing = await prisma.grindingLedger.findFirst({
      where: {
        userId: session.user.id,
        date: body.date,
        commodityType: body.commodityType,
        serialNo: body.serialNo,
      },
    });

    if (existing) {
      return apiResponseError(
        `Record with Serial No ${body.serialNo} for ${body.commodityType} on this date already exists`,
        409
      );
    }

    const createdEntry = await prisma.grindingLedger.create({
      data: {
        ...body,
        userId: session.user.id,
      },
    });

    return apiResponseSuccess(createdEntry, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiResponseError("Validation failed", 400, z.treeifyError(error));
    }

    console.error("POST /grinding-ledger error:", error);
    return apiResponseError("Internal Server Error", 500);
  }
}
