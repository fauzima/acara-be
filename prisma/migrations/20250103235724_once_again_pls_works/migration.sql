/*
  Warnings:

  - You are about to drop the column `eventId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_eventId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "eventId";

-- CreateTable
CREATE TABLE "_EventToOrder" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EventToOrder_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EventToOrder_B_index" ON "_EventToOrder"("B");

-- AddForeignKey
ALTER TABLE "_EventToOrder" ADD CONSTRAINT "_EventToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToOrder" ADD CONSTRAINT "_EventToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
