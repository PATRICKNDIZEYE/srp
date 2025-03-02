/*
  Warnings:

  - You are about to drop the column `farmerId` on the `POC` table. All the data in the column will be lost.
  - You are about to drop the column `transportId` on the `POC` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Farmer_pocId_key";

-- DropIndex
DROP INDEX "POC_farmerId_key";

-- DropIndex
DROP INDEX "POC_transportId_key";

-- DropIndex
DROP INDEX "Stock_farmerId_key";

-- DropIndex
DROP INDEX "Stock_pocId_key";

-- DropIndex
DROP INDEX "Stock_transportId_key";

-- DropIndex
DROP INDEX "Transport_pocId_key";

-- AlterTable
ALTER TABLE "POC" DROP COLUMN "farmerId",
DROP COLUMN "transportId";
