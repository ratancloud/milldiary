// Milldata with all field
export interface MillData {
  id: string
  userId: string
  date: Date

  /* -------- Credits -------- */
  millCredit: number

  flourWeight: number
  flourRs: number

  oilWeight: number
  oilRs: number

  khariWeight: number
  khariRs: number

  totalCredit: number

  /* -------- Debits -------- */
  sarsoWeight: number
  sarsoRs: number

  gehumWeight: number
  gehumRs: number

  staff1Rs: number
  staff2Rs: number
  staffDescription?: string | null

  millDebit: number
  millDescription?: string | null

  homeDebit: number
  homeDescription?: string | null

  totalDebit: number

  /* -------- Meta -------- */
  createdAt: Date
  updatedAt: Date
}

// monthly total stat
export interface MonthlyTotalStat {
  totalCredit: number;
  totalDebit: number;

  millCredit: number;

  flourWeight: number;
  flourRs: number;

  oilWeight: number;
  oilRs: number;

  khariWeight: number;
  khariRs: number;

  sarsoWeight: number;
  sarsoRs: number;

  gehumWeight: number;
  gehumRs: number;

  staff1Rs: number;
  staff2Rs: number;

  millDebit: number;
  homeDebit: number;
}

// monthly stat api response 
export interface MonthlyStatResponse {
  success: boolean;
  data: {
    items: MillData[];
    totals: MonthlyTotalStat;
  }
}

// EMPTY_MONTHLY_STAT
export const EMPTY_MONTHLY_STAT: MonthlyTotalStat = {
  totalCredit: 0,
  totalDebit: 0,
  millCredit: 0,
  flourWeight: 0,
  flourRs: 0,
  oilWeight: 0,
  oilRs: 0,
  khariWeight: 0,
  khariRs: 0,
  sarsoWeight: 0,
  sarsoRs: 0,
  gehumWeight: 0,
  gehumRs: 0,
  staff1Rs: 0,
  staff2Rs: 0,
  millDebit: 0,
  homeDebit: 0,
};

