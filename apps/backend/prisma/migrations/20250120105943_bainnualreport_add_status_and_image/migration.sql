/*
  Warnings:

  - Added the required column `status` to the `BiannualReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BiannualReport" ADD COLUMN     "image" TEXT[],
ADD COLUMN     "status" TEXT NOT NULL;
