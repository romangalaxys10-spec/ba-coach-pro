import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

/**
 * Student authentication.
 *
 * A student registers with a name and receives a secret token
 * (e.g. BAC-7K2M-QP9X-AF3D-HW6T). The token is the ONLY way to log
 * back in and continue progress, so we generate it from an
 * unambiguous alphabet (no 0/O/1/I) and store it hashed-free (the app
 * is self-hosted; the token acts like an API key).
 */

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0,O,1,I

function randomGroup(len = 4): string {
  let out = '';
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

export function generateStudentToken(): string {
  return ['BAC', randomGroup(), randomGroup(), randomGroup(), randomGroup()].join('-');
}

export function normalizeToken(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, '');
}

export const STUDENT_TOKEN_HEADER = 'x-student-token';

export type AuthedStudent = {
  id: string;
  name: string;
  token: string;
  createdAt: Date;
  lastActiveAt: Date;
  githubRepo: string | null;
  githubOwner: string | null;
  githubSyncedAt: Date | null;
  autoSync: boolean;
  hasGithubToken: boolean;
  // custom AI provider (OpenAI-compatible) saved on the student's account
  aiProviderId: string | null;
  aiBaseUrl: string | null;
  aiApiKey: string | null;
  aiModel: string | null;
  aiVerifiedAt: Date | null;
};

export async function getAuthedStudent(req: NextRequest): Promise<AuthedStudent | null> {
  const raw = req.headers.get(STUDENT_TOKEN_HEADER) || '';
  const token = normalizeToken(raw);
  if (!token) return null;

  const student = await db.student.findUnique({ where: { token } });
  if (!student) return null;

  // touch last active (fire and forget)
  void db.student
    .update({ where: { id: student.id }, data: { lastActiveAt: new Date() } })
    .catch(() => null);

  return {
    id: student.id,
    name: student.name,
    token: student.token,
    createdAt: student.createdAt,
    lastActiveAt: student.lastActiveAt,
    githubRepo: student.githubRepo,
    githubOwner: student.githubOwner,
    githubSyncedAt: student.githubSyncedAt,
    autoSync: student.autoSync,
    hasGithubToken: Boolean(student.githubToken),
    aiProviderId: student.aiProviderId,
    aiBaseUrl: student.aiBaseUrl,
    aiApiKey: student.aiApiKey,
    aiModel: student.aiModel,
    aiVerifiedAt: student.aiVerifiedAt,
  };
}

export function unauthorized() {
  return Response.json(
    { error: 'Missing or invalid student token. Please log in again.' },
    { status: 401 }
  );
}
