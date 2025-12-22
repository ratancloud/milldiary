import { z } from "zod";

const nonNegative = z
  .number("This field must contain a number.")
  .nonnegative("Value cannot be negative");

const baseMillSchema = z.object({
  // Credits
  millCredit: nonNegative,
  flourWeight: nonNegative,
  flourRs: nonNegative,
  oilWeight: nonNegative,
  oilRs: nonNegative,
  khariWeight: nonNegative,
  khariRs: nonNegative,

  // Debits
  sarsoWeight: nonNegative,
  sarsoRs: nonNegative,
  gehumWeight: nonNegative,
  gehumRs: nonNegative,

  // Staff & Expenses
  staff1Rs: nonNegative,
  staff2Rs: nonNegative,
  staffDescription: z.string().nullable().optional(),

  millDebit: nonNegative,
  millDescription: z.string().nullable().optional(),

  homeDebit: nonNegative,
  homeDescription: z.string().nullable().optional(),
});

// CREATE (POST)
export const createMillDataFormSchema = baseMillSchema.extend({
  date: z.string().min(1, "Date is required"),
});

// UPDATE (PATCH)
export const updateMillDataFormSchema = baseMillSchema.partial();

// Types for client
export type CreateMillDataFormInput = z.infer<typeof createMillDataFormSchema>;
export type UpdateMillDataFormInput = z.infer<typeof updateMillDataFormSchema>;
