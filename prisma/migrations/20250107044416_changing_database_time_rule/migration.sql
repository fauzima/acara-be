-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "expiredAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserCoupon" ALTER COLUMN "expiredAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserPoint" ALTER COLUMN "expiredAt" SET DATA TYPE TIMESTAMP(3);
