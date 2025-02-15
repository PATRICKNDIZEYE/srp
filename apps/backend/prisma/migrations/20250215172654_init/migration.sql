/*
  Warnings:

  - Added the required column `productionId` to the `TranspDerived` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TranspDerived" ADD COLUMN     "productionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TranspDerived" ADD CONSTRAINT "TranspDerived_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES "Production"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
