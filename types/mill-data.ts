/**
 * Core MillData record representing daily mill operations.
 */
export interface MillData {
  id: string;
  userId: string;
  date: Date;

  /* -------- Credits -------- */
  millCredit: number;

  flourWeight: number;
  flourRs: number;

  oilWeight: number;
  oilRs: number;

  khariWeight: number;
  khariRs: number;

  totalCredit: number;

  /* -------- Debits -------- */
  sarsoWeight: number;
  sarsoRs: number;

  gehumWeight: number;
  gehumRs: number;

  staff1Rs: number;
  staff2Rs: number;
  staffDescription?: string | null;

  millDebit: number;
  millDescription?: string | null;

  homeDebit: number;
  homeDescription?: string | null;

  totalDebit: number;

  /* -------- Meta -------- */
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Aggregated totals for credits and debits.
 */
export interface TotalStat {
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

/**
 * Aggregated grinding ledger stats (Wheat & Sarso breakdown).
 * Used across both monthly and yearly pages.
 */
export interface GrindingStat {
  totalWeight: number;
  wheatWeight: number;
  sarsoWeight: number;
  wheatMoney: number;
  sarsoMoney: number;
  totalMoney: number;
  totalRecords: number;
  wheatRecords: number;
  sarsoRecords: number;
}

/**
 * Empty/default grinding stat object.
 */
export const EMPTY_GRINDING_STAT: GrindingStat = {
  totalWeight: 0,
  wheatWeight: 0,
  sarsoWeight: 0,
  wheatMoney: 0,
  sarsoMoney: 0,
  totalMoney: 0,
  totalRecords: 0,
  wheatRecords: 0,
  sarsoRecords: 0,
};

/**
 * Empty/default totals object.
 */
export const EMPTY_TOTAL_STAT: TotalStat = {
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

/**
 * API response format for GET /api/mill-data.
 */
export interface MonthlyStatResponse {
  success: boolean;
  data: {
    items: MillData[];
    totals: TotalStat;
    grindingStats: GrindingStat;
  };
}
