-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp" INTEGER,
ADD COLUMN     "otpExpiry" TIMESTAMP(3);
