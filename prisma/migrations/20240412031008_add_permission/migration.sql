-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('ADMIN', 'USER', 'DEVELOPER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "permission" "Permission"[];
