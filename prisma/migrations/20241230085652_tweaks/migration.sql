/*
  Warnings:

  - The values [StandUpComedy] on the enum `EventCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [Lampung,Surakarta,Banten] on the enum `EventLocation` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `date` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `ticketId` on the `OrderDetails` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventCategory_new" AS ENUM ('Konser', 'Festival', 'Pertandingan', 'Pameran', 'Konferensi', 'Workshop', 'Seminar', 'Pelatihan', 'Sertifikasi');
ALTER TABLE "Event" ALTER COLUMN "category" TYPE "EventCategory_new" USING ("category"::text::"EventCategory_new");
ALTER TYPE "EventCategory" RENAME TO "EventCategory_old";
ALTER TYPE "EventCategory_new" RENAME TO "EventCategory";
DROP TYPE "EventCategory_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EventLocation_new" AS ENUM ('Jakarta', 'Bandung', 'Yogyakarta', 'Surabaya', 'Solo', 'Medan', 'Bali');
ALTER TABLE "Event" ALTER COLUMN "location" TYPE "EventLocation_new" USING ("location"::text::"EventLocation_new");
ALTER TYPE "EventLocation" RENAME TO "EventLocation_old";
ALTER TYPE "EventLocation_new" RENAME TO "EventLocation";
DROP TYPE "EventLocation_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "OrderDetails" DROP CONSTRAINT "OrderDetails_ticketId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "date",
DROP COLUMN "description",
DROP COLUMN "time",
ADD COLUMN     "desc" TEXT,
ADD COLUMN     "endDate" DATE,
ADD COLUMN     "startDate" DATE;

-- AlterTable
ALTER TABLE "OrderDetails" DROP COLUMN "ticketId";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "endDate" DATE,
ADD COLUMN     "startDate" DATE;

-- AlterTable
ALTER TABLE "UserPoint" ADD COLUMN     "ticketId" TEXT;

-- CreateTable
CREATE TABLE "_OrderDetailsToTicket" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrderDetailsToTicket_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrderDetailsToTicket_B_index" ON "_OrderDetailsToTicket"("B");

-- AddForeignKey
ALTER TABLE "UserPoint" ADD CONSTRAINT "UserPoint_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderDetailsToTicket" ADD CONSTRAINT "_OrderDetailsToTicket_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderDetailsToTicket" ADD CONSTRAINT "_OrderDetailsToTicket_B_fkey" FOREIGN KEY ("B") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
