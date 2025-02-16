/*
  Warnings:

  - The values [Pending,Approved,Completed,Rejected] on the enum `LoanStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `requestDate` on the `Loan` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LoanStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PAID');
ALTER TABLE "Loan" ALTER COLUMN "status" TYPE "LoanStatus_new" USING ("status"::text::"LoanStatus_new");
ALTER TYPE "LoanStatus" RENAME TO "LoanStatus_old";
ALTER TYPE "LoanStatus_new" RENAME TO "LoanStatus";
DROP TYPE "LoanStatus_old";
COMMIT;

-- DropIndex
DROP INDEX "Loan_farmerId_idx";

-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "requestDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
