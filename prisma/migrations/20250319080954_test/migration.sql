/*
  Warnings:

  - A unique constraint covering the columns `[jobId,userId]` on the table `JobEmails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JobEmails_jobId_userId_key" ON "JobEmails"("jobId", "userId");
