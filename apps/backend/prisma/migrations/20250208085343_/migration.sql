/*
  Warnings:

  - You are about to drop the column `entryDate` on the `Diary` table. All the data in the column will be lost.
  - You are about to drop the column `remarks` on the `Diary` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Diary` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `latitude` to the `Diary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Diary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Diary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Diary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Diary" DROP COLUMN "entryDate",
DROP COLUMN "remarks",
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Diary_phoneNumber_key" ON "Diary"("phoneNumber");
