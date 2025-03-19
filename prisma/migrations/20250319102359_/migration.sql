/*
  Warnings:

  - You are about to drop the column `priceId` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `priceName` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `slots` on the `userassets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentId]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentId` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_userId_fkey";

-- DropIndex
DROP INDEX "payment_transactionId_key";

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "priceId",
DROP COLUMN "priceName",
DROP COLUMN "transactionId",
ADD COLUMN     "paymentId" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "userassets" DROP COLUMN "slots",
ADD COLUMN     "coverslot" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "resumeslot" INTEGER NOT NULL DEFAULT 1;

-- DropEnum
DROP TYPE "PaymentStatus";

-- CreateIndex
CREATE UNIQUE INDEX "payment_paymentId_key" ON "payment"("paymentId");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
