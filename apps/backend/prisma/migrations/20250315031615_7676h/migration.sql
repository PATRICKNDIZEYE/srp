/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `StockIn` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `StockOut` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `StockOut` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Made the column `dailyId` on table `StockOut` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `StockOut` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "StockOut" DROP CONSTRAINT "StockOut_dailyId_fkey";

-- AlterTable
ALTER TABLE "StockIn" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "StockOut" DROP COLUMN "updatedAt",
ADD COLUMN     "stockInId" INTEGER,
ALTER COLUMN "amount" SET DATA TYPE INTEGER,
ALTER COLUMN "dailyId" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "StockOut" ADD CONSTRAINT "StockOut_stockInId_fkey" FOREIGN KEY ("stockInId") REFERENCES "StockIn"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockOut" ADD CONSTRAINT "StockOut_dailyId_fkey" FOREIGN KEY ("dailyId") REFERENCES "Diary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
