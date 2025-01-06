/*
  Warnings:

  - You are about to drop the `_EventToOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrderToUser` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `expiredAt` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_EventToOrder" DROP CONSTRAINT "_EventToOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToOrder" DROP CONSTRAINT "_EventToOrder_B_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToUser" DROP CONSTRAINT "_OrderToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToUser" DROP CONSTRAINT "_OrderToUser_B_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "eventId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "expiredAt" SET NOT NULL;

-- DropTable
DROP TABLE "_EventToOrder";

-- DropTable
DROP TABLE "_OrderToUser";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
