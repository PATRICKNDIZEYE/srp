-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('Pending', 'Approved', 'Completed', 'Rejected');

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
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT,
    "resetToken" TEXT,
    "resetTokenExpires" TIMESTAMP(3),
    "otp" INTEGER,
    "otpExpiry" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "productType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "farmerId" INTEGER,
    "pocId" INTEGER,
    "transportId" INTEGER,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "POC" (
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
    "address" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "farmerId" INTEGER,
    "transportId" INTEGER,

    CONSTRAINT "POC_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "Transport" (
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
    "status" TEXT NOT NULL,
    "delivered" JSONB,
    "pocId" INTEGER,

    CONSTRAINT "Transport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Derivery" (
    "id" SERIAL NOT NULL,
    "transportId" INTEGER NOT NULL,
    "productionId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transportStatus" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Derivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Derived" (
    "id" SERIAL NOT NULL,
    "diaryId" INTEGER NOT NULL,
    "transportId" INTEGER NOT NULL,
    "deriveryId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Derived_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diary" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "approveStatus" TEXT NOT NULL DEFAULT 'pending',
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Diary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Production" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "approveStatus" TEXT NOT NULL DEFAULT 'pending',
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Production_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Transportations" (
    "id" SERIAL NOT NULL,
    "transportId" INTEGER NOT NULL,
    "pocId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transportStatus" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transportations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranspDerived" (
    "id" SERIAL NOT NULL,
    "transportId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productionId" INTEGER NOT NULL,
    "transportationId" INTEGER NOT NULL,

    CONSTRAINT "TranspDerived_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DeriveryToTranspDerived" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DeriveryToTranspDerived_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_farmerId_key" ON "Stock"("farmerId");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_pocId_key" ON "Stock"("pocId");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_transportId_key" ON "Stock"("transportId");

-- CreateIndex
CREATE UNIQUE INDEX "POC_nationalId_key" ON "POC"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "POC_phoneNumber_key" ON "POC"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "POC_username_key" ON "POC"("username");

-- CreateIndex
CREATE UNIQUE INDEX "POC_farmerId_key" ON "POC"("farmerId");

-- CreateIndex
CREATE UNIQUE INDEX "POC_transportId_key" ON "POC"("transportId");

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_nationalId_key" ON "Farmer"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_phoneNumber_key" ON "Farmer"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_username_key" ON "Farmer"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_pocId_key" ON "Farmer"("pocId");

-- CreateIndex
CREATE UNIQUE INDEX "Transport_nationalId_key" ON "Transport"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "Transport_phoneNumber_key" ON "Transport"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Transport_username_key" ON "Transport"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Transport_pocId_key" ON "Transport"("pocId");

-- CreateIndex
CREATE UNIQUE INDEX "Diary_phoneNumber_key" ON "Diary"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Production_phoneNumber_key" ON "Production"("phoneNumber");

-- CreateIndex
CREATE INDEX "Loan_farmerId_idx" ON "Loan"("farmerId");

-- CreateIndex
CREATE INDEX "_DeriveryToTranspDerived_B_index" ON "_DeriveryToTranspDerived"("B");

-- AddForeignKey
ALTER TABLE "MilkSubmission" ADD CONSTRAINT "MilkSubmission_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_pocId_fkey" FOREIGN KEY ("pocId") REFERENCES "POC"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farmer" ADD CONSTRAINT "Farmer_pocId_fkey" FOREIGN KEY ("pocId") REFERENCES "POC"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_pocId_fkey" FOREIGN KEY ("pocId") REFERENCES "POC"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Derivery" ADD CONSTRAINT "Derivery_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Derived" ADD CONSTRAINT "Derived_diaryId_fkey" FOREIGN KEY ("diaryId") REFERENCES "Diary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Derived" ADD CONSTRAINT "Derived_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Derived" ADD CONSTRAINT "Derived_deriveryId_fkey" FOREIGN KEY ("deriveryId") REFERENCES "Derivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transportations" ADD CONSTRAINT "Transportations_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transportations" ADD CONSTRAINT "Transportations_pocId_fkey" FOREIGN KEY ("pocId") REFERENCES "POC"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranspDerived" ADD CONSTRAINT "TranspDerived_transportationId_fkey" FOREIGN KEY ("transportationId") REFERENCES "Transportations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranspDerived" ADD CONSTRAINT "TranspDerived_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES "Production"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranspDerived" ADD CONSTRAINT "TranspDerived_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeriveryToTranspDerived" ADD CONSTRAINT "_DeriveryToTranspDerived_A_fkey" FOREIGN KEY ("A") REFERENCES "Derivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeriveryToTranspDerived" ADD CONSTRAINT "_DeriveryToTranspDerived_B_fkey" FOREIGN KEY ("B") REFERENCES "TranspDerived"("id") ON DELETE CASCADE ON UPDATE CASCADE;
