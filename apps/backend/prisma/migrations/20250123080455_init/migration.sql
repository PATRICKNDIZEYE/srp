/*
  Warnings:

  - The values [FIRST_HALF] on the enum `BiannualType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `areaOfIntervention` on the `AnnualTarget` table. All the data in the column will be lost.
  - You are about to drop the column `relevantIndicators` on the `AnnualTarget` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BiannualType_new" AS ENUM ('LAST_HALF');
ALTER TABLE "BiannualReport" ALTER COLUMN "biannualType" TYPE "BiannualType_new" USING ("biannualType"::text::"BiannualType_new");
ALTER TYPE "BiannualType" RENAME TO "BiannualType_old";
ALTER TYPE "BiannualType_new" RENAME TO "BiannualType";
DROP TYPE "BiannualType_old";
COMMIT;

-- AlterTable
ALTER TABLE "AnnualTarget" DROP COLUMN "areaOfIntervention",
DROP COLUMN "relevantIndicators";

-- CreateTable
CREATE TABLE "AreaOfIntervention" (
    "id" SERIAL NOT NULL,
    "areaOfIntervention" TEXT NOT NULL,
    "relevantIndicators" TEXT[],
    "annualTargetId" INTEGER NOT NULL,

    CONSTRAINT "AreaOfIntervention_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AreaOfIntervention_annualTargetId_idx" ON "AreaOfIntervention"("annualTargetId");

-- AddForeignKey
ALTER TABLE "AreaOfIntervention" ADD CONSTRAINT "AreaOfIntervention_annualTargetId_fkey" FOREIGN KEY ("annualTargetId") REFERENCES "AnnualTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
