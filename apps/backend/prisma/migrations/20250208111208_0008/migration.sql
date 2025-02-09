/*
  Warnings:

  - You are about to drop the column `data` on the `Derived` table. All the data in the column will be lost.
  - You are about to drop the column `diaryId` on the `Derived` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Derived" DROP CONSTRAINT "Derived_diaryId_fkey";

-- AlterTable
ALTER TABLE "Derived" DROP COLUMN "data",
DROP COLUMN "diaryId",
ADD COLUMN     "dailyStatus" JSONB,
ADD COLUMN     "pocStatus" JSONB,
ADD COLUMN     "transportDeliveredStatus" JSONB,
ADD COLUMN     "transportReceiverStatus" JSONB;

-- CreateTable
CREATE TABLE "_DerivedToDiary" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DerivedToDiary_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DerivedToDiary_B_index" ON "_DerivedToDiary"("B");

-- AddForeignKey
ALTER TABLE "_DerivedToDiary" ADD CONSTRAINT "_DerivedToDiary_A_fkey" FOREIGN KEY ("A") REFERENCES "Derived"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DerivedToDiary" ADD CONSTRAINT "_DerivedToDiary_B_fkey" FOREIGN KEY ("B") REFERENCES "Diary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
