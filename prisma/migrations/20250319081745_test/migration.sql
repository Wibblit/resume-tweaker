/*
  Warnings:

  - You are about to drop the column `jobDescription` on the `JD` table. All the data in the column will be lost.
  - Added the required column `jdUrl` to the `JD` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JD" DROP COLUMN "jobDescription",
ADD COLUMN     "jdUrl" TEXT NOT NULL;
