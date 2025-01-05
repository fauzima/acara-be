/*
  Warnings:

  - You are about to drop the column `ticketId` on the `AttendeeTicket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttendeeTicket" DROP CONSTRAINT "AttendeeTicket_ticketId_fkey";

-- AlterTable
ALTER TABLE "AttendeeTicket" DROP COLUMN "ticketId";
