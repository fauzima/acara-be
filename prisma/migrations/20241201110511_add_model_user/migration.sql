-- CreateEnum
CREATE TYPE "RoleUser" AS ENUM ('User', 'Admin');

-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('pria', 'wanita');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "nomorHP" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "jenis_kelamin" "JenisKelamin" NOT NULL,
    "role" "RoleUser" NOT NULL DEFAULT 'User',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
