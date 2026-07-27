import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { apiResponseError, apiResponseSuccess } from "@/lib/api-response";
import z from "zod";
import {
  UpdateGrindingLedgerInput,
  updateGrindingLedgerValidator,
} from "@/lib/validators/grindingLedgerApi";

// GET : api/grinding-ledger/[id]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return apiResponseError("Unauthorized", 401);
    }

    const { id } = await context.params;

    if (!id) {
      return apiResponseError("Invalid ID", 400);
    }

    const data = await prisma.grindingLedger.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!data) {
      return apiResponseError("Grinding ledger record not found", 404);
    }

    return apiResponseSuccess(data);
  } catch (error) {
    console.error("GET /grinding-ledger/[id] error:", error);
    return apiResponseError("Internal server error", 500);
  }
}

// PATCH : api/grinding-ledger/[id]
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return apiResponseError("Unauthorized", 401);
    }

    const { id } = await context.params;

    if (!id) {
      return apiResponseError("Invalid ID", 400);
    }

    const json = await req.json();
    const body = updateGrindingLedgerValidator.parse(json);

    const cleanDataForUpdate: UpdateGrindingLedgerInput = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(cleanDataForUpdate).length === 0) {
      return apiResponseError("No fields provided for update", 400);
    }

    const existing = await prisma.grindingLedger.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return apiResponseError("Record not found", 404);
    }

    // If changing serialNo, date, or commodityType, verify unique constraint won't fail
    if (
      cleanDataForUpdate.serialNo ||
      cleanDataForUpdate.date ||
      cleanDataForUpdate.commodityType
    ) {
      const checkSerialNo = cleanDataForUpdate.serialNo ?? existing.serialNo;
      const checkDate = cleanDataForUpdate.date ?? existing.date;
      const checkCommodityType = cleanDataForUpdate.commodityType ?? existing.commodityType;

      const duplicate = await prisma.grindingLedger.findFirst({
        where: {
          userId: session.user.id,
          date: checkDate,
          commodityType: checkCommodityType,
          serialNo: checkSerialNo,
          NOT: { id },
        },
      });

      if (duplicate) {
        return apiResponseError(
          `Another record with Serial No ${checkSerialNo} already exists for this commodity and date`,
          409
        );
      }
    }

    const updatedEntry = await prisma.grindingLedger.update({
      where: { id },
      data: cleanDataForUpdate,
    });

    return apiResponseSuccess(updatedEntry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiResponseError("Validation failed", 400, z.treeifyError(error));
    }

    console.error("PATCH /grinding-ledger/[id] error:", error);
    return apiResponseError("Internal Server Error", 500);
  }
}

// DELETE : api/grinding-ledger/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return apiResponseError("Unauthorized", 401);
    }

    const { id } = await context.params;

    if (!id) {
      return apiResponseError("Invalid ID", 400);
    }

    const existing = await prisma.grindingLedger.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return apiResponseError("Record not found", 404);
    }

    await prisma.grindingLedger.delete({
      where: { id },
    });

    return apiResponseSuccess({ message: "Record deleted successfully", id });
  } catch (error) {
    console.error("DELETE /grinding-ledger/[id] error:", error);
    return apiResponseError("Internal Server Error", 500);
  }
}
