/*
  Warnings:

  - The `domainsOfIntervention` column on the `NGO` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `sectors` column on the `NGO` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cells` column on the `NGO` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `targetGroups` column on the `NGO` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `typesOfTrainingProvided` column on the `NGO` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `resources` column on the `NGO` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `supportingDocuments` column on the `NGO` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "NGO" DROP COLUMN "domainsOfIntervention",
ADD COLUMN     "domainsOfIntervention" TEXT[],
DROP COLUMN "sectors",
ADD COLUMN     "sectors" TEXT[],
DROP COLUMN "cells",
ADD COLUMN     "cells" TEXT[],
DROP COLUMN "targetGroups",
ADD COLUMN     "targetGroups" TEXT[],
DROP COLUMN "typesOfTrainingProvided",
ADD COLUMN     "typesOfTrainingProvided" TEXT[],
DROP COLUMN "resources",
ADD COLUMN     "resources" TEXT[],
DROP COLUMN "supportingDocuments",
ADD COLUMN     "supportingDocuments" TEXT[];
