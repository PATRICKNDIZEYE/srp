-- CreateEnum
CREATE TYPE "BiannualType" AS ENUM ('FIRST_HALF', 'LAST_HALF');

-- CreateTable
CREATE TABLE "BiannualReport" (
    "id" SERIAL NOT NULL,
    "relevantIndicators" TEXT NOT NULL,
    "progressAgainstTarget" DOUBLE PRECISION NOT NULL,
    "targetNumbersReached" INTEGER NOT NULL,
    "genderDisaggregation" "GenderDisaggregation" NOT NULL,
    "interventionArea" TEXT NOT NULL,
    "budgetUsed" DOUBLE PRECISION NOT NULL,
    "progressUpdate" TEXT NOT NULL,
    "challengesFaced" TEXT NOT NULL,
    "successStories" TEXT NOT NULL,
    "attachments" TEXT[],
    "biannualType" "BiannualType" NOT NULL,
    "annualTargetId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BiannualReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BiannualReport" ADD CONSTRAINT "BiannualReport_annualTargetId_fkey" FOREIGN KEY ("annualTargetId") REFERENCES "AnnualTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
