import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { GrindingLedger, GrindingLedgerStat } from "@/types/grinding-ledger";
import toast from "react-hot-toast";
import { formateIndDate } from "./helper";

interface ExportGrindingLedgerParams {
  data: GrindingLedger[];
  stats: GrindingLedgerStat;
  year: string;
  month: string;
}

export const handleExportGrindingLedger = async ({
  data,
  stats,
  year,
  month,
}: ExportGrindingLedgerParams) => {
  if (!data || data.length === 0) {
    toast.error("No ledger data available for export");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Grinding Ledger");

  // Define Columns
  worksheet.columns = [
    { header: "Date", key: "date", width: 15 },
    { header: "S.No", key: "serialNo", width: 10 },
    { header: "Commodity", key: "commodityType", width: 15 },
    { header: "Customer Name (En)", key: "customerNameEn", width: 22 },
    { header: "Customer Name (Hi)", key: "customerNameHi", width: 22 },
    { header: "Village (En)", key: "villageEn", width: 20 },
    { header: "Village (Hi)", key: "villageHi", width: 20 },
    { header: "Weight (Kg)", key: "weight", width: 15 },
  ];

  // Add Totals Summary Row
  const totalRow = worksheet.addRow({
    date: "SUMMARY",
    serialNo: "-",
    commodityType: `Total: ${stats.totalRecords}`,
    customerNameEn: `Wheat: ${stats.wheatWeight} Kg`,
    customerNameHi: `Mustard: ${stats.mustardWeight} Kg`,
    villageEn: `Top: ${stats.topVillage}`,
    villageHi: "Total Weight:",
    weight: `${stats.totalWeight} Kg`,
  });

  // Add Data Rows
  data.forEach((item) => {
    worksheet.addRow({
      date: formateIndDate(new Date(item.date)),
      serialNo: item.serialNo,
      commodityType: item.commodityType === "WHEAT" ? "Wheat" : "Mustard",
      customerNameEn: item.customerNameEn,
      customerNameHi: item.customerNameHi,
      villageEn: item.villageEn,
      villageHi: item.villageHi,
      weight: item.weight,
    });
  });

  // Style Totals Row
  totalRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF333333" },
    };
    cell.alignment = { horizontal: "center" };
  });

  // Style Header Row
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: { argb: "FF000000" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF59E0B" }, // Amber color
    };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `Grinding_Ledger_${month}_${year}.xlsx`);
};
