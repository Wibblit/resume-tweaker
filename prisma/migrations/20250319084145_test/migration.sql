/*
  Warnings:

  - You are about to drop the column `jdUrl` on the `JD` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[r2FileName]` on the table `JD` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `r2FileName` to the `JD` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JD" DROP COLUMN "jdUrl",
ADD COLUMN     "r2FileName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "JD_r2FileName_key" ON "JD"("r2FileName");
