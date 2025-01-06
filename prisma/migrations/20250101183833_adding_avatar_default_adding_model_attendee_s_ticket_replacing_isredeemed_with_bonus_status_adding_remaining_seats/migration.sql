/*
  Warnings:

  - You are about to drop the column `isRedeemed` on the `UserCoupon` table. All the data in the column will be lost.
  - You are about to drop the column `isRedeemed` on the `UserPoint` table. All the data in the column will be lost.
  - You are about to drop the column `ticketId` on the `UserPoint` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[attendeeTicketId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Made the column `avatar` on table `Promotor` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `attendeeTicketId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Made the column `avatar` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "BonusStatus" AS ENUM ('Available', 'isRedeemed', 'Expired');

-- DropForeignKey
ALTER TABLE "UserPoint" DROP CONSTRAINT "UserPoint_ticketId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "paymentProof" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Promotor" ALTER COLUMN "avatar" SET NOT NULL,
ALTER COLUMN "avatar" SET DEFAULT 'https://res.cloudinary.com/dowc5iu9c/image/upload/v1735754490/avatar/default-avatar.png';

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "attendeeTicketId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "remainingSeats" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatar" SET NOT NULL,
ALTER COLUMN "avatar" SET DEFAULT 'https://res.cloudinary.com/dowc5iu9c/image/upload/v1735754490/avatar/default-avatar.png';

-- AlterTable
ALTER TABLE "UserCoupon" DROP COLUMN "isRedeemed",
ADD COLUMN     "orderId" INTEGER,
ADD COLUMN     "status" "BonusStatus" NOT NULL DEFAULT 'Available';

-- AlterTable
ALTER TABLE "UserPoint" DROP COLUMN "isRedeemed",
DROP COLUMN "ticketId",
ADD COLUMN     "orderId" INTEGER,
ADD COLUMN     "status" "BonusStatus" NOT NULL DEFAULT 'Available';

-- CreateTable
CREATE TABLE "AttendeeTicket" (
    "id" TEXT NOT NULL,
    "isAttended" BOOLEAN NOT NULL DEFAULT false,
    "orderDetailsId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,

    CONSTRAINT "AttendeeTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_attendeeTicketId_key" ON "Review"("attendeeTicketId");

-- AddForeignKey
ALTER TABLE "UserPoint" ADD CONSTRAINT "UserPoint_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCoupon" ADD CONSTRAINT "UserCoupon_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendeeTicket" ADD CONSTRAINT "AttendeeTicket_orderDetailsId_fkey" FOREIGN KEY ("orderDetailsId") REFERENCES "OrderDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendeeTicket" ADD CONSTRAINT "AttendeeTicket_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_attendeeTicketId_fkey" FOREIGN KEY ("attendeeTicketId") REFERENCES "AttendeeTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
