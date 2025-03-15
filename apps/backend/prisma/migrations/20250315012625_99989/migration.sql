/*
  Warnings:

  - Made the column `pocId` on table `Farmer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Farmer" DROP CONSTRAINT "Farmer_pocId_fkey";

-- AlterTable
ALTER TABLE "Farmer" ALTER COLUMN "pocId" SET NOT NULL;

-- CreateTable
CREATE TABLE "StockIn" (
    "id" SERIAL NOT NULL,
    "productionId" INTEGER NOT NULL,
    "product" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockOut" (
    "id" SERIAL NOT NULL,
    "productionId" INTEGER NOT NULL,
    "product" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dailyId" INTEGER,
    "status" TEXT DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockOut_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Farmer" ADD CONSTRAINT "Farmer_pocId_fkey" FOREIGN KEY ("pocId") REFERENCES "POC"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockIn" ADD CONSTRAINT "StockIn_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES "Production"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockOut" ADD CONSTRAINT "StockOut_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES "Production"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockOut" ADD CONSTRAINT "StockOut_dailyId_fkey" FOREIGN KEY ("dailyId") REFERENCES "Diary"("id") ON DELETE SET NULL ON UPDATE CASCADE;
