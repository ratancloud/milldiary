import { z } from "zod";
import { CommodityType } from "@/generated/prisma/enums";

export const baseGrindingClientSchema = z.object({
  serialNo: z.number("Serial No is required").int("Must be an integer").positive("Must be positive"),
  commodityType: z.nativeEnum(CommodityType, "Commodity Type is required"),
  customerNameEn: z.string().min(1, "English Name is required"),
  customerNameHi: z.string().min(1, "Hindi Name is required"),
  villageEn: z.string().min(1, "English Village is required"),
  villageHi: z.string().min(1, "Hindi Village is required"),
  weight: z.number("Weight is required").positive("Weight must be greater than 0"),
});

export const createGrindingLedgerFormSchema = baseGrindingClientSchema.extend({
  date: z.string().min(1, "Date is required"),
});

export const updateGrindingLedgerFormSchema = baseGrindingClientSchema.partial().extend({
  date: z.string().optional(),
});

export type CreateGrindingLedgerFormInput = z.infer<typeof createGrindingLedgerFormSchema>;
export type UpdateGrindingLedgerFormInput = z.infer<typeof updateGrindingLedgerFormSchema>;
