import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { MillData, MonthlyTotalStat } from "@/types/mill-data";
import toast from "react-hot-toast";
import { formateIndDate } from "./helper";

interface ExportToExcelParams {
  data: MillData[];
  totals: MonthlyTotalStat;
  year: string;
  month: string;
}

export const handleExportToExcel = async ({
  data,
  totals,
  year,
  month,
}: ExportToExcelParams) => {
  if (data.length === 0) {
    toast.error("No data available for this month");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Mill Data");

  // Define Columns
  worksheet.columns = [
    { header: "Date", key: "date", width: 15 },
    { header: "Mill Credit (Rs)", key: "millCredit", width: 18 },
    { header: "Flour Weight (Kg)", key: "flourWeight", width: 18 },
    { header: "Flour Amount (Rs)", key: "flourRs", width: 18 },
    { header: "Oil Weight (Kg)", key: "oilWeight", width: 18 },
    { header: "Oil Amount (Rs)", key: "oilRs", width: 18 },
    { header: "Khari Weight (Kg)", key: "khariWeight", width: 18 },
    { header: "Khari Amount (Rs)", key: "khariRs", width: 18 },
    { header: "Total Credit (Rs)", key: "totalCredit", width: 20 },
    { header: "Sarso Weight (Kg)", key: "sarsoWeight", width: 18 },
    { header: "Sarso Amount (Rs)", key: "sarsoRs", width: 18 },
    { header: "Gehum Weight (Kg)", key: "gehumWeight", width: 18 },
    { header: "Gehum Amount (Rs)", key: "gehumRs", width: 18 },
    { header: "Staff 1 (Rs)", key: "staff1Rs", width: 15 },
    { header: "Staff 2 (Rs)", key: "staff2Rs", width: 15 },
    { header: "Staff Description", key: "staffDescription", width: 25 },
    { header: "Mill Debit (Rs)", key: "millDebit", width: 18 },
    { header: "Mill Description", key: "millDescription", width: 25 },
    { header: "Home Debit (Rs)", key: "homeDebit", width: 18 },
    { header: "Home Description", key: "homeDescription", width: 25 },
    { header: "Total Debit (Rs)", key: "totalDebit", width: 20 },
  ];

  // Add Monthly Totals Row
  const totalRow = worksheet.addRow({
    date: "MONTHLY TOTAL",
    millCredit: totals.millCredit,
    flourWeight: totals.flourWeight,
    flourRs: totals.flourRs,
    oilWeight: totals.oilWeight,
    oilRs: totals.oilRs,
    khariWeight: totals.khariWeight,
    khariRs: totals.khariRs,
    totalCredit: totals.totalCredit,
    sarsoWeight: totals.sarsoWeight,
    sarsoRs: totals.sarsoRs,
    gehumWeight: totals.gehumWeight,
    gehumRs: totals.gehumRs,
    staff1Rs: totals.staff1Rs,
    staff2Rs: totals.staff2Rs,
    staffDescription: "Description",
    millDebit: totals.millDebit,
    millDescription: "Description",
    homeDebit: totals.homeDebit,
    homeDescription: "Description",
    totalDebit: totals.totalDebit,
  });

  // Add Data Rows
  data.forEach((item) => {
    worksheet.addRow({
      date: formateIndDate(item.date),
      millCredit: item.millCredit,
      flourWeight: item.flourWeight,
      flourRs: item.flourRs,
      oilWeight: item.oilWeight,
      oilRs: item.oilRs,
      khariWeight: item.khariWeight,
      khariRs: item.khariRs,
      totalCredit: item.totalCredit,
      sarsoWeight: item.sarsoWeight,
      sarsoRs: item.sarsoRs,
      gehumWeight: item.gehumWeight,
      gehumRs: item.gehumRs,
      staff1Rs: item.staff1Rs,
      staff2Rs: item.staff2Rs,
      staffDescription: item.staffDescription ?? "-",
      millDebit: item.millDebit,
      millDescription: item.millDescription ?? "-",
      homeDebit: item.homeDebit,
      homeDescription: item.homeDescription ?? "-",
      totalDebit: item.totalDebit,
    });
  });

  // Style the Totals Row (Background color & Bold)
  totalRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF000000" },
    };
    cell.alignment = { horizontal: "center" };
  });

  // Header Styling
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: { argb: "FF000000" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFFF00" },
    };
  });

  // Save File
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `Mill_Diary_${month}_${year}.xlsx`);
};
