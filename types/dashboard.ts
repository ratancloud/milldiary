export interface YearSummaryCard {
  year: number;
  totalCredit: number;
  totalDebit: number;
  tMillDebit: number;
  tHomeDebit: number;
  netIncome: number;
  netSaving: number;
}

export interface MonthlyMillCredit {
  month: number;
  monthLabel: string;

  millCredit: number;

  flourRs: number;
  flourWeight: number;

  oilRs: number;
  oilWeight: number;

  khariRs: number;
  khariWeight: number;

  totalCredit: number;
}

export interface MonthlyMillDebit {
  month: number;
  monthLabel: string;

  gehumRs: number;
  gehumWeight: number;

  sarsoRs: number;
  sarsoWeight: number;

  staff1Cost: number;
  staff2Cost: number;
  millDebit: number;

  totalMillDebit: number;
}

export interface MonthlyHomeDebit {
  month: number;
  monthLabel: string;
  homeDebit: number;
}

export interface MillDashboardResponse {
  summary: YearSummaryCard;
  monthlyCredit: MonthlyMillCredit[];
  monthlyMillDebit: MonthlyMillDebit[];
  monthlyHomeDebit: MonthlyHomeDebit[];
}
