/*
  Warnings:

  - You are about to drop the column `nGOId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `senderType` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_nGOId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "nGOId",
ADD COLUMN     "senderType" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Message_senderId_senderType_idx" ON "Message"("senderId", "senderType");

-- RenameForeignKey
ALTER TABLE "Message" RENAME CONSTRAINT "Message_senderId_fkey" TO "Message_senderUser_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "NGO"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderNGO_fkey" FOREIGN KEY ("senderId") REFERENCES "NGO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
