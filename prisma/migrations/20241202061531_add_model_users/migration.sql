/*
  Warnings:

  - The values [Admin] on the enum `RoleUser` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoleUser_new" AS ENUM ('User', 'Organizer');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "RoleUser_new" USING ("role"::text::"RoleUser_new");
ALTER TYPE "RoleUser" RENAME TO "RoleUser_old";
ALTER TYPE "RoleUser_new" RENAME TO "RoleUser";
DROP TYPE "RoleUser_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'User';
COMMIT;
