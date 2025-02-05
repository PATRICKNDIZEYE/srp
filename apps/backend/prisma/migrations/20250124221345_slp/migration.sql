-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
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
CREATE TABLE "Farmers" (
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

    CONSTRAINT "Farmers_pkey" PRIMARY KEY ("id")
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
    "derivered" JSONB,
    "pocId" INTEGER,

    CONSTRAINT "Transport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Derived" (
    "id" SERIAL NOT NULL,
    "transportId" INTEGER NOT NULL,
    "diaryId" INTEGER,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Derived_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diary" (
    "id" SERIAL NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "remarks" TEXT,
    "transportId" INTEGER NOT NULL,
    "approveStatus" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "Diary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_farmerId_key" ON "Stock"("farmerId");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_pocId_key" ON "Stock"("pocId");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_transportId_key" ON "Stock"("transportId");

-- CreateIndex
CREATE UNIQUE INDEX "POC_nationalId_key" ON "POC"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "POC_username_key" ON "POC"("username");

-- CreateIndex
CREATE UNIQUE INDEX "POC_farmerId_key" ON "POC"("farmerId");

-- CreateIndex
CREATE UNIQUE INDEX "POC_transportId_key" ON "POC"("transportId");

-- CreateIndex
CREATE UNIQUE INDEX "Farmers_nationalId_key" ON "Farmers"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "Farmers_username_key" ON "Farmers"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Farmers_pocId_key" ON "Farmers"("pocId");

-- CreateIndex
CREATE UNIQUE INDEX "Transport_nationalId_key" ON "Transport"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "Transport_username_key" ON "Transport"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Transport_pocId_key" ON "Transport"("pocId");

-- CreateIndex
CREATE UNIQUE INDEX "Diary_transportId_key" ON "Diary"("transportId");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_pocId_fkey" FOREIGN KEY ("pocId") REFERENCES "POC"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farmers" ADD CONSTRAINT "Farmers_pocId_fkey" FOREIGN KEY ("pocId") REFERENCES "POC"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_pocId_fkey" FOREIGN KEY ("pocId") REFERENCES "POC"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Derived" ADD CONSTRAINT "Derived_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Derived" ADD CONSTRAINT "Derived_diaryId_fkey" FOREIGN KEY ("diaryId") REFERENCES "Diary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diary" ADD CONSTRAINT "Diary_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
