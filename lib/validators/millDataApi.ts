import { z } from "zod";

const nonNegative = z.number().nonnegative("Value cannot be negative");

export const baseMillDataValidator = z.object({
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

// Create Schema: Adds the date and keeps fields required
export const createMillDataValidator = baseMillDataValidator.extend({
  date: z.coerce.date(),
}).strict();

// Update Schema: Makes all fields optional for partial updates
export const updateMillDataValidator = baseMillDataValidator
  .partial()
  .strict();

export type CreateMillDataInput = z.infer<typeof createMillDataValidator>;
export type UpdateMillDataInput = z.infer<typeof updateMillDataValidator>;