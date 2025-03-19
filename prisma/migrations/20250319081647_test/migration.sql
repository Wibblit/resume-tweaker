/*
  Warnings:

  - Added the required column `userId` to the `JD` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JD" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "JD" ADD CONSTRAINT "JD_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
