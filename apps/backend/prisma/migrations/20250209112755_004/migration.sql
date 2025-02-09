/*
  Warnings:

  - Added the required column `deriveryId` to the `Derived` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Derived" ADD COLUMN     "deriveryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Derived" ADD CONSTRAINT "Derived_deriveryId_fkey" FOREIGN KEY ("deriveryId") REFERENCES "Derivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
