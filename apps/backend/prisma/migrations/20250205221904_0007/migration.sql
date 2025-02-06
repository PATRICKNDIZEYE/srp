/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Farmer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Farmer_phoneNumber_key" ON "Farmer"("phoneNumber");
