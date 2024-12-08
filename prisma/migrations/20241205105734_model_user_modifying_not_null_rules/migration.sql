-- AlterTable
ALTER TABLE "User" ALTER COLUMN "refCode" DROP NOT NULL;

-- DropEnum
DROP TYPE "Gender";
