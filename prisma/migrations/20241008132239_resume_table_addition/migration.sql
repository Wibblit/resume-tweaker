-- CreateTable
CREATE TABLE "resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resumeName" TEXT NOT NULL,
    "basics" JSONB NOT NULL DEFAULT '[]',
    "summary" JSONB NOT NULL DEFAULT '[]',
    "profiles" JSONB NOT NULL DEFAULT '[]',
    "skills" JSONB NOT NULL DEFAULT '[]',
    "projects" JSONB NOT NULL DEFAULT '[]',
    "education" JSONB NOT NULL DEFAULT '[]',
    "experience" JSONB NOT NULL DEFAULT '[]',
    "languages" JSONB NOT NULL DEFAULT '[]',
    "volunteer" JSONB NOT NULL DEFAULT '[]',
    "awards" JSONB NOT NULL DEFAULT '[]',
    "publications" JSONB NOT NULL DEFAULT '[]',
    "certifications" JSONB NOT NULL DEFAULT '[]',
    "references" JSONB NOT NULL DEFAULT '[]',
    "styles" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "resume_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "resume" ADD CONSTRAINT "resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
