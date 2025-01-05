/*
  Warnings:

  - You are about to drop the `_OrderDetailsToTicket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrderDetailsToTicket" DROP CONSTRAINT "_OrderDetailsToTicket_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderDetailsToTicket" DROP CONSTRAINT "_OrderDetailsToTicket_B_fkey";

-- AlterTable
ALTER TABLE "OrderDetails" ADD COLUMN     "ticketId" TEXT;

-- DropTable
DROP TABLE "_OrderDetailsToTicket";

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
