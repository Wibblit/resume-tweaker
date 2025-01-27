/*
  Warnings:

  - You are about to drop the column `slots` on the `userassets` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_userId_fkey";

-- AlterTable
ALTER TABLE "userassets" DROP COLUMN "slots",
ADD COLUMN     "coverslot" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "resumeslot" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
