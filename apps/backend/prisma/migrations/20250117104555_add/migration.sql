/*
  Warnings:

  - You are about to drop the column `userId` on the `NGO` table. All the data in the column will be lost.
  - Added the required column `password` to the `NGO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `NGO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NGO" DROP CONSTRAINT "NGO_userId_fkey";

-- AlterTable
ALTER TABLE "NGO" DROP COLUMN "userId",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL;
