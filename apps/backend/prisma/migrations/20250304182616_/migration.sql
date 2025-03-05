/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Production` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Production" ADD COLUMN     "username" TEXT NOT NULL DEFAULT 'lionson';

-- CreateIndex
CREATE UNIQUE INDEX "Production_username_key" ON "Production"("username");
