/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "CategoryEvent" AS ENUM ('Konser', 'Festival', 'StandUpComedy');

-- CreateEnum
CREATE TYPE "LocationEvent" AS ENUM ('Jakarta', 'Lampung', 'Surakarta', 'Banten', 'Bandung');

-- CreateEnum
CREATE TYPE "StatusOrder" AS ENUM ('Pending', 'Paid', 'Cancel');

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "userId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "isVerify" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "role" SET DEFAULT 'User',
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Promotor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "isVerify" BOOLEAN NOT NULL,

    CONSTRAINT "Promotor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "CategoryEvent" NOT NULL,
    "location" "LocationEvent" NOT NULL,
    "venue" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "time" TIME NOT NULL,
    "promotorId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "price" BIGINT NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Point" (
    "id" INTEGER NOT NULL,
    "point" INTEGER NOT NULL,
    "createAt" DATE NOT NULL,
    "expireAt" DATE NOT NULL,
    "isRedeem" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "User_Point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Coupon" (
    "id" INTEGER NOT NULL,
    "isRedeem" BOOLEAN NOT NULL DEFAULT false,
    "percentage" INTEGER NOT NULL DEFAULT 10,
    "createAt" DATE NOT NULL,
    "expireAt" DATE NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "User_Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "final_price" INTEGER NOT NULL,
    "status" "StatusOrder" NOT NULL DEFAULT 'Pending',
    "userId" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "payment_proof" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order_details" (
    "id" INTEGER NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "Order_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_promotorId_fkey" FOREIGN KEY ("promotorId") REFERENCES "Promotor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Point" ADD CONSTRAINT "User_Point_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Coupon" ADD CONSTRAINT "User_Coupon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_details" ADD CONSTRAINT "Order_details_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_details" ADD CONSTRAINT "Order_details_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
