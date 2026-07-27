import { z } from "zod";
import { CommodityType } from "@/generated/prisma/enums";

export const baseGrindingLedgerValidator = z.object({
  serialNo: z.number().int().positive("Serial No must be a positive integer"),
  commodityType: z.nativeEnum(CommodityType),
  customerNameEn: z.string().min(1, "English Name is required"),
  customerNameHi: z.string().min(1, "Hindi Name is required"),
  villageEn: z.string().min(1, "English Village is required"),
  villageHi: z.string().min(1, "Hindi Village is required"),
  weight: z.number().positive("Weight must be greater than 0"),
});

export const createGrindingLedgerValidator = baseGrindingLedgerValidator.extend({
  date: z.coerce.date(),
}).strict();

export const insertManyGrindingLedgerValidator = z.object({
  date: z.coerce.date(),
  commodityType: z.nativeEnum(CommodityType),
  records: z.array(
    z.object({
      serialNo: z.number().int().positive(),
      customerNameEn: z.string().min(1),
      customerNameHi: z.string().min(1),
      villageEn: z.string().min(1),
      villageHi: z.string().min(1),
      weight: z.number().positive(),
    })
  ).min(1, "At least one record is required"),
});

export const updateGrindingLedgerValidator = baseGrindingLedgerValidator
  .partial()
  .extend({
    date: z.coerce.date().optional(),
  })
  .strict();

export type CreateGrindingLedgerInput = z.infer<typeof createGrindingLedgerValidator>;
export type InsertManyGrindingLedgerInput = z.infer<typeof insertManyGrindingLedgerValidator>;
export type UpdateGrindingLedgerInput = z.infer<typeof updateGrindingLedgerValidator>;
