/*
  Warnings:

  - Added the required column `addedOn` to the `JD` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JD" ADD COLUMN     "addedOn" TEXT NOT NULL;
