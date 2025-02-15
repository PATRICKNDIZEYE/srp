/*
  Warnings:

  - You are about to drop the column `productionId` on the `TranspDerived` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TranspDerived" DROP CONSTRAINT "TranspDerived_productionId_fkey";

-- AlterTable
ALTER TABLE "TranspDerived" DROP COLUMN "productionId";
