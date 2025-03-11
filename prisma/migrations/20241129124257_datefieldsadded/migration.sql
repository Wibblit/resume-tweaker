/*
  Warnings:

  - Added the required column `updatedOn` to the `coverletter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedOn` to the `resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "coverletter" ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedOn" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "resume" ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedOn" TIMESTAMP(3) NOT NULL;
