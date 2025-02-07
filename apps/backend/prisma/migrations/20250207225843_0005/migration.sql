/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Transport` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transport_phoneNumber_key" ON "Transport"("phoneNumber");
