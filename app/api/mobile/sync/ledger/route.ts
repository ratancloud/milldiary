import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lastSyncAt = searchParams.get("lastSyncAt");

    // 2. Always enforce the 10-day retention window
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    tenDaysAgo.setUTCHours(0, 0, 0, 0); // Start of day 10 days ago

    const where: Prisma.GrindingLedgerWhereInput = {
      userId: session.user.id,
      date: { gte: tenDaysAgo }, // Only grab records intended for the mobile 10-day window
    };

    // 3. Delta Sync Filter: Apply ONLY if lastSyncAt exists (skip for fresh installs)
    if (lastSyncAt) {
      const syncDate = new Date(lastSyncAt);
      if (!isNaN(syncDate.getTime())) {
        where.updatedAt = { gt: syncDate };
      }
    }

    // 4. Query Prisma (Optimized with Select)
    const allChanges = await prisma.grindingLedger.findMany({
      where,
      orderBy: { updatedAt: "asc" },
      select: {
        id: true,
        userId: true,
        date: true,
        serialNo: true,
        commodityType: true,
        customerNameEn: true,
        customerNameHi: true,
        villageEn: true,
        villageHi: true,
        weight: true,
      }
    });

    // 5. Map to mobile schema
    const upserted = allChanges.map((tx) => ({
      id: tx.id,
      userId: tx.userId,
      date: tx.date.toISOString().split("T")[0], // YYYY-MM-DD
      serialNo: tx.serialNo,
      commodityType: tx.commodityType.toLowerCase(),
      customerNameEn: tx.customerNameEn,
      customerNameHi: tx.customerNameHi,
      villageEn: tx.villageEn,
      villageHi: tx.villageHi,
      weight: tx.weight,
      rupees: tx.commodityType === "WHEAT" ? tx.weight * 3 : tx.weight * 5,
    }));

    console.log(`[Sync API] Returning ${upserted.length}`);

    return NextResponse.json({
      upserted,
      deletedIds: [], // Array ready for future soft-deletions
      serverTimestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Sync API Error]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}