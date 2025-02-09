/*
  Warnings:

  - You are about to drop the column `transportId` on the `Diary` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Diary" DROP CONSTRAINT "Diary_transportId_fkey";

-- DropIndex
DROP INDEX "Diary_transportId_key";

-- AlterTable
ALTER TABLE "Diary" DROP COLUMN "transportId";
