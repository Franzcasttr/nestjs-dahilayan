/*
  Warnings:

  - You are about to drop the column `role` on the `AdminLogin` table. All the data in the column will be lost.
  - You are about to drop the column `permissions` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('User', 'Admin', 'SuperAdmin');

-- AlterTable
ALTER TABLE "AdminLogin" DROP COLUMN "role",
ADD COLUMN     "roles" "Roles"[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "permissions",
DROP COLUMN "role",
ADD COLUMN     "roles" "Roles"[];

-- DropEnum
DROP TYPE "Permission";

-- DropEnum
DROP TYPE "Role";
