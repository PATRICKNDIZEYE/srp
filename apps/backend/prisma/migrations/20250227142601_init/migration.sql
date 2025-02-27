-- CreateTable
CREATE TABLE "DailySale" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productType" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "pricePerUnit" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "diaryId" INTEGER NOT NULL,

    CONSTRAINT "DailySale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailySale_diaryId_idx" ON "DailySale"("diaryId");

-- AddForeignKey
ALTER TABLE "DailySale" ADD CONSTRAINT "DailySale_diaryId_fkey" FOREIGN KEY ("diaryId") REFERENCES "Diary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
