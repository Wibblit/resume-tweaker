-- CreateTable
CREATE TABLE "Tokens" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expires" BIGINT NOT NULL,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobEmails" (
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
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobEmails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JD" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "r2FileName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "logoSrc" TEXT NOT NULL,
    "salaryRange" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "workType" TEXT NOT NULL,
    "addedOn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "JD_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_userId_key" ON "Tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_email_key" ON "Tokens"("email");

-- CreateIndex
CREATE UNIQUE INDEX "JobEmails_jobId_userId_key" ON "JobEmails"("jobId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "JD_r2FileName_key" ON "JD"("r2FileName");

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobEmails" ADD CONSTRAINT "JobEmails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JD" ADD CONSTRAINT "JD_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
