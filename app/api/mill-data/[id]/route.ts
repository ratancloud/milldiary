import { headers } from "next/headers";
import { NextRequest } from "next/server";import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { apiResponseError, apiResponseSuccess } from "@/lib/api-response";
import z from "zod";
import { UpdateMillDataInput, updateMillDataValidator } from "@/lib/validators/millDataApi";

// GET : api/mill-data/[id]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return apiResponseError("Unauthorized", 401);
    }

    // check id
    const { id } = await context.params;

    if (!id) {
      return apiResponseError("Invalid ID", 400);
    }

    const data = await prisma.millData.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!data) {
      return apiResponseError("Mill data not found", 404);
    }

    return apiResponseSuccess(data);
  } catch (error) {
    console.error("GET /mill-data/[id] error:", error);
    return apiResponseError("Internal server error", 500);
  }
}

// PATCH : api/mill-data/[id]
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    /* ---------- Auth ---------- */
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return apiResponseError("Unauthorized", 401);
    }

    /* ---------- Params ---------- */
    const { id } = await context.params;

    if (!id) {
      return apiResponseError("Invalid ID", 400);
    }

    /* ---------- Body ---------- */
    const json = await req.json();
    const body = updateMillDataValidator.parse(json);

    // clean data
    const cleanDataForUpdate: UpdateMillDataInput = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(cleanDataForUpdate).length === 0) {
      return apiResponseError("No fields provided for update", 400);
    }

    /* ---------- check user with data ---------- */
    const existing = await prisma.millData.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return apiResponseError("Record not found", 404);
    }

    const totalCredit =
      (cleanDataForUpdate.millCredit ?? existing.millCredit) +
      (cleanDataForUpdate.flourRs ?? existing.flourRs) +
      (cleanDataForUpdate.oilRs ?? existing.oilRs) +
      (cleanDataForUpdate.khariRs ?? existing.khariRs);

    const totalDebit =
      (cleanDataForUpdate.sarsoRs ?? existing.sarsoRs) +
      (cleanDataForUpdate.gehumRs ?? existing.gehumRs) +
      (cleanDataForUpdate.staff1Rs ?? existing.staff1Rs) +
      (cleanDataForUpdate.staff2Rs ?? existing.staff2Rs) +
      (cleanDataForUpdate.millDebit ?? existing.millDebit) +
      (cleanDataForUpdate.homeDebit ?? existing.homeDebit);

    const updatedEntry = await prisma.millData.update({
      where: { id },
      data: {
        ...cleanDataForUpdate,
        totalCredit,
        totalDebit,
      },
    });

    return apiResponseSuccess(updatedEntry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiResponseError("Validation failed", 400, z.treeifyError(error));
    }

    console.error("PATCH /mill-data/[id] error:", error);

    return apiResponseError("Internal Server Error", 500);
  }
}
