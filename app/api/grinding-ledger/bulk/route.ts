import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import z from "zod";
import { apiResponseError, apiResponseSuccess } from "@/lib/api-response";
import { insertManyGrindingLedgerValidator } from "@/lib/validators/grindingLedgerApi";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return apiResponseError("Unauthorized", 401);
    }

    const json = await req.json();
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
        message: `Successfully inserted ${result.count} records into Grinding Ledger`,
      },
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiResponseError("Validation failed", 400, z.treeifyError(error));
    }

    console.error("POST /grinding-ledger/bulk error:", error);
    return apiResponseError("Internal Server Error", 500);
  }
}
