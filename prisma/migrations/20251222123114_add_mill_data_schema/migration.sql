-- CreateTable
CREATE TABLE "mill_data" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "millCredit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "flourWeight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "flourRs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "oilWeight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "oilRs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "khariWeight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "khariRs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCredit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sarsoWeight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sarsoRs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gehumWeight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gehumRs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "staff1Rs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "staff2Rs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "staffDescription" TEXT,
    "millDebit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "millDescription" TEXT,
    "homeDebit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "homeDescription" TEXT,
    "totalDebit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mill_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mill_data_userId_date_idx" ON "mill_data"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "mill_data_userId_date_key" ON "mill_data"("userId", "date");

-- AddForeignKey
ALTER TABLE "mill_data" ADD CONSTRAINT "mill_data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
