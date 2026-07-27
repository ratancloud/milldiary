-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "CommodityType" AS ENUM ('WHEAT', 'MUSTARD');

-- DropForeignKey
ALTER TABLE "mill_data" DROP CONSTRAINT "mill_data_userId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "ROLE" NOT NULL DEFAULT 'STAFF';

-- CreateTable
CREATE TABLE "GrindingLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "serialNo" INTEGER NOT NULL,
    "commodityType" "CommodityType" NOT NULL,
    "customerNameEn" TEXT NOT NULL,
    "customerNameHi" TEXT NOT NULL,
    "villageEn" TEXT NOT NULL,
    "villageHi" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrindingLedger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GrindingLedger_date_commodityType_idx" ON "GrindingLedger"("date", "commodityType");

-- CreateIndex
CREATE UNIQUE INDEX "GrindingLedger_userId_date_commodityType_serialNo_key" ON "GrindingLedger"("userId", "date", "commodityType", "serialNo");

-- AddForeignKey
ALTER TABLE "mill_data" ADD CONSTRAINT "mill_data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrindingLedger" ADD CONSTRAINT "GrindingLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
