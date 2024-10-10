-- CreateTable
CREATE TABLE "coverletter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coverName" TEXT NOT NULL,
    "salutation" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "recipientInfo" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "opening" TEXT NOT NULL,
    "interestInPosition" TEXT NOT NULL,
    "professionalSummary" TEXT NOT NULL,
    "keyAchievements" TEXT NOT NULL,
    "culturalFit" TEXT NOT NULL,
    "closing" TEXT NOT NULL,
    "signOff" TEXT NOT NULL,
    "styles" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "coverletter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "coverletter" ADD CONSTRAINT "coverletter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
