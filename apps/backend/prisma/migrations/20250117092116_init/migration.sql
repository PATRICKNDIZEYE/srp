-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'NGO');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NGO" (
    "id" SERIAL NOT NULL,
    "nameOfTheNGO" TEXT NOT NULL,
    "physicalAddress" TEXT NOT NULL,
    "operationalAddress" TEXT,
    "domainsOfIntervention" TEXT[],
    "descriptionOfInterventions" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "sectors" TEXT[],
    "cells" TEXT[],
    "targetGroups" TEXT[],
    "targetedNumberOfBeneficiaries" INTEGER NOT NULL,
    "numberOfStaffCommunityFacilitators" INTEGER NOT NULL,
    "numberOfTrainedStaffCommunityFacilitators" INTEGER NOT NULL,
    "typesOfTrainingProvided" TEXT NOT NULL,
    "resources" TEXT NOT NULL,
    "annualEstimatedBudget" INTEGER NOT NULL,
    "sourceOfFunding" TEXT NOT NULL,
    "nameOfLegalRepresentatives" TEXT NOT NULL,
    "nameOfContactPersons" TEXT NOT NULL,
    "telForContactPersons" TEXT NOT NULL,
    "contactPersonsEmail" TEXT NOT NULL,
    "supportingDocuments" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "NGO_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "NGO" ADD CONSTRAINT "NGO_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
