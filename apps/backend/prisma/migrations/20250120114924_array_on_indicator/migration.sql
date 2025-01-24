/*
  Warnings:

  - The `relevantIndicators` column on the `BiannualReport` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BiannualReport" DROP COLUMN "relevantIndicators",
ADD COLUMN     "relevantIndicators" TEXT[];
