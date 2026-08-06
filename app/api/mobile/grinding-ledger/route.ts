import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { apiResponseError, apiResponseSuccess } from "@/lib/api-response";
import { Prisma } from "@/generated/prisma/client";

// GET: api/mobile/grinding-ledger -> get records with filters
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log(session);
    

    if (!session?.user?.id) {
      return apiResponseError("Unauthorized", 401);
    }

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");
    const commodityType = searchParams.get("commodityType");
    const updatedAfter = searchParams.get("updatedAfter");

    const where: Prisma.GrindingLedgerWhereInput = {
      userId: session.user.id,
    };

    if (!dateStr) {
      return apiResponseError("Date parameter is required", 400);
    }

    where.date = new Date(dateStr);

    if (commodityType && commodityType !== "ALL" && (commodityType === "WHEAT" || commodityType === "MUSTARD")) {
      where.commodityType = commodityType;
    }

    if (updatedAfter) {
      where.updatedAt = {
        gt: new Date(updatedAfter),
      };
    }

    const items = await prisma.grindingLedger.findMany({
      where,
      orderBy: [
        { date: "desc" },
        { commodityType: "asc" },
        { serialNo: "asc" },
      ],
    });
    console.log("GET /mobile/grinding-ledger items:", items);
    return apiResponseSuccess(items);
  } catch (error) {
    console.error("GET /mobile/grinding-ledger error:", error);
    return apiResponseError("Internal Server Error", 500);
  }
}