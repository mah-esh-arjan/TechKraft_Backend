/*
  Warnings:

  - Added the required column `name` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;
