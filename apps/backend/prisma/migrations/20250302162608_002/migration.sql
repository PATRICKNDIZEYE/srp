/*
  Warnings:

  - A unique constraint covering the columns `[nationalId]` on the table `Diary` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `Diary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Diary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationalId` to the `Diary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Diary" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "nationalId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Diary_nationalId_key" ON "Diary"("nationalId");
