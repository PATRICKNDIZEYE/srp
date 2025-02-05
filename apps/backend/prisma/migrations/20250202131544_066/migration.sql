/*
  Warnings:

  - You are about to drop the column `derivered` on the `Transport` table. All the data in the column will be lost.
  - You are about to drop the `Farmers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productType` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Farmers" DROP CONSTRAINT "Farmers_pocId_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_farmerId_fkey";

-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "productType" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transport" DROP COLUMN "derivered",
ADD COLUMN     "delivered" JSONB;

-- DropTable
DROP TABLE "Farmers";

-- CreateTable
CREATE TABLE "MilkSubmission" (
    "id" SERIAL NOT NULL,
    "milkType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "farmerId" INTEGER NOT NULL,

    CONSTRAINT "MilkSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farmer" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "nationalId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "farmDetails" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "pocId" INTEGER,

    CONSTRAINT "Farmer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_nationalId_key" ON "Farmer"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_username_key" ON "Farmer"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_pocId_key" ON "Farmer"("pocId");

-- AddForeignKey
ALTER TABLE "MilkSubmission" ADD CONSTRAINT "MilkSubmission_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farmer" ADD CONSTRAINT "Farmer_pocId_fkey" FOREIGN KEY ("pocId") REFERENCES "POC"("id") ON DELETE SET NULL ON UPDATE CASCADE;
