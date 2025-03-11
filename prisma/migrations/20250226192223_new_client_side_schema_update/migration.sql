/*
  Warnings:

  - You are about to drop the column `refereshToken` on the `Tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `Tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tokens" DROP COLUMN "refereshToken",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "refreshToken" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Jobs" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "jobState" TEXT NOT NULL,
    "jobRole" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "workType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "meetingUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JD" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "logoSrc" TEXT NOT NULL,
    "salaryRange" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "workType" TEXT NOT NULL,

    CONSTRAINT "JD_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_email_key" ON "Tokens"("email");

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
