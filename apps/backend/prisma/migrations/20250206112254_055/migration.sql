-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('Pending', 'Approved', 'Completed', 'Rejected');

-- CreateTable
CREATE TABLE "Loan" (
    "id" SERIAL NOT NULL,
    "loanAmount" DOUBLE PRECISION NOT NULL,
    "purpose" TEXT NOT NULL,
    "status" "LoanStatus" NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "farmerId" INTEGER NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Loan_farmerId_idx" ON "Loan"("farmerId");

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
