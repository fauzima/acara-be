/*
  Warnings:

  - Made the column `desc` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endDate` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startDate` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endDate` on table `Ticket` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startDate` on table `Ticket` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "desc" SET NOT NULL,
ALTER COLUMN "endDate" SET NOT NULL,
ALTER COLUMN "startDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "endDate" SET NOT NULL,
ALTER COLUMN "startDate" SET NOT NULL;
