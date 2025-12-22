import { EMPTY_MONTHLY_STAT, MillData, MonthlyTotalStat } from "@/types/mill-data";

// Rs. 12,000 or Rs. 12,000.5
export const formatRs = (value?: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: value && value % 1 !== 0 ? 1 : 0,
    maximumFractionDigits: 1,
  }).format(value ?? 0);

// 45.7 Kg
export const formatKg = (value?: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: value && value % 1 !== 0 ? 1 : 0,
    maximumFractionDigits: 1,
  }).format(value ?? 0);


// 45.7 Kg / Rs. 1,200.5
export const formatKgRs = (kg?: number, rs?: number) => {
  const cleanKg = typeof kg === "number" ? kg : 0;
  const cleanRs = typeof rs === "number" ? rs : 0;

  if (!cleanKg && !cleanRs) return "-";
  if (!cleanKg) return `Rs. ${formatRs(cleanRs)}`;

  return `${formatKg(cleanKg)} Kg / Rs. ${formatRs(cleanRs)}`;
};

// formate Indian date
export const formateIndDate = (date: Date) => {
   return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Server-side Totals Calculator 
export function calculateTotals(
  rows: MillData[]
): MonthlyTotalStat {
  return rows.reduce<MonthlyTotalStat>((acc, row) => {
    acc.totalCredit += row.totalCredit;
    acc.totalDebit += row.totalDebit;

    acc.millCredit += row.millCredit;

    acc.flourWeight += row.flourWeight;
    acc.flourRs += row.flourRs;

    acc.oilWeight += row.oilWeight;
    acc.oilRs += row.oilRs;

    acc.khariWeight += row.khariWeight;
    acc.khariRs += row.khariRs;

    acc.sarsoWeight += row.sarsoWeight;
    acc.sarsoRs += row.sarsoRs;

    acc.gehumWeight += row.gehumWeight;
    acc.gehumRs += row.gehumRs;

    acc.staff1Rs += row.staff1Rs;
    acc.staff2Rs += row.staff2Rs;

    acc.millDebit += row.millDebit;
    acc.homeDebit += row.homeDebit;

    return acc;
  }, { ...EMPTY_MONTHLY_STAT });
}

