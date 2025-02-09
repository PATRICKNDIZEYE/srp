/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Derivery` table. All the data in the column will be lost.
  - You are about to drop the column `dailyStatus` on the `Derivery` table. All the data in the column will be lost.
  - You are about to drop the column `pocStatus` on the `Derivery` table. All the data in the column will be lost.
  - You are about to drop the column `transportDeliveredStatus` on the `Derivery` table. All the data in the column will be lost.
  - You are about to drop the column `transportReceiverStatus` on the `Derivery` table. All the data in the column will be lost.
  - You are about to drop the `_DeriveryToDiary` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `Derivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pocId` to the `Derivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportStatus` to the `Derivery` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_DeriveryToDiary" DROP CONSTRAINT "_DeriveryToDiary_A_fkey";

-- DropForeignKey
ALTER TABLE "_DeriveryToDiary" DROP CONSTRAINT "_DeriveryToDiary_B_fkey";

-- AlterTable
ALTER TABLE "Derivery" DROP COLUMN "createdAt",
DROP COLUMN "dailyStatus",
DROP COLUMN "pocStatus",
DROP COLUMN "transportDeliveredStatus",
DROP COLUMN "transportReceiverStatus",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "pocId" INTEGER NOT NULL,
ADD COLUMN     "transportStatus" TEXT NOT NULL;

-- DropTable
DROP TABLE "_DeriveryToDiary";

-- AddForeignKey
ALTER TABLE "Derivery" ADD CONSTRAINT "Derivery_pocId_fkey" FOREIGN KEY ("pocId") REFERENCES "POC"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
