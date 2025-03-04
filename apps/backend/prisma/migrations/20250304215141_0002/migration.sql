-- CreateTable
CREATE TABLE "RequestMilk" (
    "id" SERIAL NOT NULL,
    "diaryIdFrom" INTEGER NOT NULL,
    "diaryIdAccept" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestMilk_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RequestMilk" ADD CONSTRAINT "RequestMilk_diaryIdFrom_fkey" FOREIGN KEY ("diaryIdFrom") REFERENCES "Diary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestMilk" ADD CONSTRAINT "RequestMilk_diaryIdAccept_fkey" FOREIGN KEY ("diaryIdAccept") REFERENCES "Diary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
