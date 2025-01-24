-- DropForeignKey
ALTER TABLE "AnnualTarget" DROP CONSTRAINT "AnnualTarget_district_sector_cell_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropIndex
DROP INDEX "Message_receiverId_idx";

-- DropIndex
DROP INDEX "Message_senderId_idx";

-- AlterTable
ALTER TABLE "AnnualTarget" ADD COLUMN     "interventionAreaCell" TEXT,
ADD COLUMN     "interventionAreaDistrict" TEXT,
ADD COLUMN     "interventionAreaSector" TEXT;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "nGOId" INTEGER;

-- AddForeignKey
ALTER TABLE "AnnualTarget" ADD CONSTRAINT "AnnualTarget_interventionAreaDistrict_interventionAreaSect_fkey" FOREIGN KEY ("interventionAreaDistrict", "interventionAreaSector", "interventionAreaCell") REFERENCES "InterventionArea"("district", "sector", "cell") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_nGOId_fkey" FOREIGN KEY ("nGOId") REFERENCES "NGO"("id") ON DELETE SET NULL ON UPDATE CASCADE;
