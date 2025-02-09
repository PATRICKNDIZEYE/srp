/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Derived` table. All the data in the column will be lost.
  - You are about to drop the column `dailyStatus` on the `Derived` table. All the data in the column will be lost.
  - You are about to drop the column `pocStatus` on the `Derived` table. All the data in the column will be lost.
  - You are about to drop the column `transportDeliveredStatus` on the `Derived` table. All the data in the column will be lost.
  - You are about to drop the column `transportReceiverStatus` on the `Derived` table. All the data in the column will be lost.
  - You are about to drop the `_DerivedToDiary` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `Derived` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diaryId` to the `Derived` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Derived` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_DerivedToDiary" DROP CONSTRAINT "_DerivedToDiary_A_fkey";

-- DropForeignKey
ALTER TABLE "_DerivedToDiary" DROP CONSTRAINT "_DerivedToDiary_B_fkey";

-- AlterTable
ALTER TABLE "Derived" DROP COLUMN "createdAt",
DROP COLUMN "dailyStatus",
DROP COLUMN "pocStatus",
DROP COLUMN "transportDeliveredStatus",
DROP COLUMN "transportReceiverStatus",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "diaryId" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- DropTable
DROP TABLE "_DerivedToDiary";

-- CreateTable
CREATE TABLE "Derivery" (
    "id" SERIAL NOT NULL,
    "transportId" INTEGER NOT NULL,
    "pocStatus" JSONB,
    "dailyStatus" JSONB,
    "transportReceiverStatus" JSONB,
    "transportDeliveredStatus" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Derivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DeriveryToDiary" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DeriveryToDiary_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DeriveryToDiary_B_index" ON "_DeriveryToDiary"("B");

-- AddForeignKey
ALTER TABLE "Derivery" ADD CONSTRAINT "Derivery_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Derived" ADD CONSTRAINT "Derived_diaryId_fkey" FOREIGN KEY ("diaryId") REFERENCES "Diary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeriveryToDiary" ADD CONSTRAINT "_DeriveryToDiary_A_fkey" FOREIGN KEY ("A") REFERENCES "Derivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeriveryToDiary" ADD CONSTRAINT "_DeriveryToDiary_B_fkey" FOREIGN KEY ("B") REFERENCES "Diary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
