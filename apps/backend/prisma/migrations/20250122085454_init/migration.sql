/*
  Warnings:

  - The `genderDisaggregation` column on the `AnnualTarget` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `genderDisaggregation` column on the `BiannualReport` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AnnualTarget" DROP COLUMN "genderDisaggregation",
ADD COLUMN     "genderDisaggregation" TEXT[];

-- AlterTable
ALTER TABLE "BiannualReport" DROP COLUMN "genderDisaggregation",
ADD COLUMN     "genderDisaggregation" TEXT[];

-- DropEnum
DROP TYPE "GenderDisaggregation";
