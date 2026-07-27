import { CommodityType } from "@/generated/prisma/enums";

export interface GrindingLedger {
  id: string;
  userId: string;
  date: string | Date;
  serialNo: number;
  commodityType: CommodityType;
  customerNameEn: string;
  customerNameHi: string;
  villageEn: string;
  villageHi: string;
  weight: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface GrindingLedgerStat {
  totalRecords: number;
  totalWeight: number;
  wheatWeight: number;
  mustardWeight: number;
  averageWeight: number;
  topVillage: string;
}

export interface GrindingLedgerResponse {
  success: boolean;
  message?: string;
  data?: {
    items: GrindingLedger[];
    stats: GrindingLedgerStat;
  };
  error?: string;
}

export const EMPTY_GRINDING_LEDGER_STAT: GrindingLedgerStat = {
  totalRecords: 0,
  totalWeight: 0,
  wheatWeight: 0,
  mustardWeight: 0,
  averageWeight: 0,
  topVillage: "-",
};
