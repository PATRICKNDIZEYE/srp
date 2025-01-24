/*
  Warnings:

  - You are about to drop the column `ngoId` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_ngoId_fkey";

-- DropIndex
DROP INDEX "Message_ngoId_idx";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "ngoId",
ADD COLUMN     "receiverId" INTEGER;

-- CreateIndex
CREATE INDEX "Message_receiverId_idx" ON "Message"("receiverId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "NGO"("id") ON DELETE SET NULL ON UPDATE CASCADE;
