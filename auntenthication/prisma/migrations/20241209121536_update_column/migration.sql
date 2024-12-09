/*
  Warnings:

  - You are about to drop the column `createAt` on the `User_Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `User_Point` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User_Coupon" DROP COLUMN "createAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User_Point" DROP COLUMN "createAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "point" SET DEFAULT 10000;
