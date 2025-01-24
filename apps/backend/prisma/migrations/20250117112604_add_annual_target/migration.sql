/*
  Warnings:

  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GenderDisaggregation" AS ENUM ('Male', 'Female', 'Other');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL;

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "AnnualTarget" (
    "id" SERIAL NOT NULL,
    "organizationName" INTEGER NOT NULL,
    "activityName" TEXT NOT NULL,
    "activityDescription" TEXT NOT NULL,
    "areaOfIntervention" TEXT NOT NULL,
    "relevantIndicators" TEXT NOT NULL,
    "targetForSelectedIndicator" TEXT NOT NULL,
    "targetedBeneficiaries" TEXT NOT NULL,
    "targetNumbers" INTEGER NOT NULL,
    "genderDisaggregation" "GenderDisaggregation" NOT NULL,
    "district" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "cell" TEXT NOT NULL,
    "plannedBudget" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnnualTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterventionArea" (
    "district" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "cell" TEXT NOT NULL,

    CONSTRAINT "InterventionArea_pkey" PRIMARY KEY ("district","sector","cell")
);

-- AddForeignKey
ALTER TABLE "AnnualTarget" ADD CONSTRAINT "AnnualTarget_district_sector_cell_fkey" FOREIGN KEY ("district", "sector", "cell") REFERENCES "InterventionArea"("district", "sector", "cell") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnualTarget" ADD CONSTRAINT "AnnualTarget_organizationName_fkey" FOREIGN KEY ("organizationName") REFERENCES "NGO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
