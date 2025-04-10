/*
  Warnings:

  - You are about to drop the column `paymentId` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `coverslot` on the `userassets` table. All the data in the column will be lost.
  - You are about to drop the column `resumeslot` on the `userassets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `priceId` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceName` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_userId_fkey";

-- DropIndex
DROP INDEX "payment_paymentId_key";

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "paymentId",
DROP COLUMN "productId",
DROP COLUMN "productName",
ADD COLUMN     "priceId" TEXT NOT NULL,
ADD COLUMN     "priceName" TEXT NOT NULL,
ADD COLUMN     "transactionId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL;

-- AlterTable
ALTER TABLE "userassets" DROP COLUMN "coverslot",
DROP COLUMN "resumeslot",
ADD COLUMN     "slots" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactionId_key" ON "payment"("transactionId");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
