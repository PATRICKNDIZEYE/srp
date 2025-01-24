/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Made the column `operationalAddress` on table `NGO` required. This step will fail if there are existing NULL values in that column.
  - Made the column `supportingDocuments` on table `NGO` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "NGO" ALTER COLUMN "operationalAddress" SET NOT NULL,
ALTER COLUMN "domainsOfIntervention" SET NOT NULL,
ALTER COLUMN "domainsOfIntervention" SET DATA TYPE TEXT,
ALTER COLUMN "sectors" SET NOT NULL,
ALTER COLUMN "sectors" SET DATA TYPE TEXT,
ALTER COLUMN "cells" SET NOT NULL,
ALTER COLUMN "cells" SET DATA TYPE TEXT,
ALTER COLUMN "targetGroups" SET NOT NULL,
ALTER COLUMN "targetGroups" SET DATA TYPE TEXT,
ALTER COLUMN "annualEstimatedBudget" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "supportingDocuments" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "username",
ADD COLUMN     "name" TEXT NOT NULL;
