import { PrismaClient } from '@prisma/client';
import { ghDbEnabled, ghModels } from '@/lib/ghdb';

/**
 * Prisma singleton (local/self-hosted) with automatic schema bootstrap,
 * OR a GitHub-backed durable adapter when DEMO_DB_* env vars are present
 * (used on ephemeral hosts like the Vercel demo).
 *
 * `db` is a thin proxy that awaits schema readiness before delegating to
 * Prisma, so route handlers need no extra awaits.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const schemaReady: Promise<void> = (async () => {
  const client = new PrismaClient();
  try {
    await client.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Student" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "token" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "lastActiveAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "githubToken" TEXT,
      "githubRepo" TEXT,
      "githubOwner" TEXT,
      "githubSyncedAt" DATETIME,
      "autoSync" BOOLEAN NOT NULL DEFAULT true
    );`);
    await client.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Student_token_key" ON "Student"("token");`);
    await client.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Conversation" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "studentId" TEXT NOT NULL,
      "title" TEXT NOT NULL DEFAULT 'New conversation',
      "mode" TEXT NOT NULL DEFAULT 'coach',
      "skillSlug" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      CONSTRAINT "Conversation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );`);
    await client.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Message" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "conversationId" TEXT NOT NULL,
      "role" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );`);
    await client.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "QuizAttempt" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "studentId" TEXT NOT NULL,
      "skillSlug" TEXT NOT NULL,
      "category" TEXT NOT NULL,
      "score" INTEGER NOT NULL,
      "total" INTEGER NOT NULL,
      "details" TEXT NOT NULL DEFAULT '[]',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "QuizAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );`);
    await client.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "LessonProgress" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "studentId" TEXT NOT NULL,
      "itemId" TEXT NOT NULL,
      "completed" BOOLEAN NOT NULL DEFAULT false,
      "updatedAt" DATETIME NOT NULL,
      CONSTRAINT "LessonProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );`);
    await client.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "LessonProgress_studentId_itemId_key" ON "LessonProgress"("studentId","itemId");`);
    await client.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "FlashcardStat" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "studentId" TEXT NOT NULL,
      "skillSlug" TEXT NOT NULL,
      "known" INTEGER NOT NULL DEFAULT 0,
      "total" INTEGER NOT NULL DEFAULT 0,
      "updatedAt" DATETIME NOT NULL,
      CONSTRAINT "FlashcardStat_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );`);
    await client.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "FlashcardStat_studentId_skillSlug_key" ON "FlashcardStat"("studentId","skillSlug");`);
    await client.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Conversation_studentId_idx" ON "Conversation"("studentId");`);
    await client.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Message_conversationId_idx" ON "Message"("conversationId");`);
  } catch (e) {
    console.error('[db] schema bootstrap failed:', e);
  } finally {
    await client.$disconnect().catch(() => null);
  }
})();

function wrapModelDelegate(delegate: object, ready: Promise<void>): object {
  return new Proxy(delegate, {
    get(t, prop, recv) {
      const value = Reflect.get(t, prop, recv);
      if (typeof value === 'function') {
        return (...args: unknown[]) => ready.then(() => value.apply(t, args));
      }
      return value;
    },
  });
}

const prisma = globalForPrisma.prisma ?? new PrismaClient();

const prismaProxy = new Proxy(prisma, {
  get(target, prop, recv) {
    const value = Reflect.get(target, prop, recv);
    if (typeof value === 'function') {
      // $connect, $transaction, $queryRaw, $executeRawUnsafe, …
      return (...args: unknown[]) => schemaReady.then(() => value.apply(target, args));
    }
    if (value && typeof value === 'object' && 'findUnique' in (value as object)) {
      // model delegate (student, conversation, message, …)
      return wrapModelDelegate(value as object, schemaReady);
    }
    return value;
  },
});

/** GitHub-backed durable adapter (public demo) or Prisma proxy (local). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db: PrismaClient = (ghDbEnabled ? ghModels : prismaProxy) as any as PrismaClient;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
