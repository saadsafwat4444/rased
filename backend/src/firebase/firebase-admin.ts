 import * as admin from 'firebase-admin';

type ServiceAccountLike = {
  // camelCase keys
  projectId?: string;
  clientEmail?: string;
  privateKey?: string;
  // original JSON keys to satisfy firebase-admin expectations
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

function stripWrappingQuotes(value: string) {
  const trimmed = value.trim();
  const first = trimmed[0];
  const last = trimmed[trimmed.length - 1];
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function normalizePrivateKey(value: string) {
  return stripWrappingQuotes(value).replace(/\\n/g, '\n');
}

function parseServiceAccountJson(raw: string): Record<string, unknown> {
  const cleaned = stripWrappingQuotes(raw);
  return JSON.parse(cleaned) as Record<string, unknown>;
}

function loadServiceAccountFromEnv(): ServiceAccountLike {
  // Preferred: store full service account json in one env var (easy on Railway).
  const jsonDirect = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (jsonDirect) {
    const parsed = parseServiceAccountJson(jsonDirect) as ServiceAccountLike;
    if (typeof parsed.private_key === 'string') {
      parsed.private_key = normalizePrivateKey(parsed.private_key);
      parsed.privateKey = parsed.private_key;
    }
    if (typeof parsed.project_id === 'string') {
      parsed.projectId = parsed.project_id;
    }
    if (typeof parsed.client_email === 'string') {
      parsed.clientEmail = parsed.client_email;
    }
    return parsed;
  }

  const jsonBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (jsonBase64) {
    const decoded = Buffer.from(stripWrappingQuotes(jsonBase64), 'base64').toString('utf8');
    const parsed = parseServiceAccountJson(decoded) as ServiceAccountLike;
    if (typeof parsed.private_key === 'string') {
      parsed.private_key = normalizePrivateKey(parsed.private_key);
      parsed.privateKey = parsed.private_key;
    }
    if (typeof parsed.project_id === 'string') {
      parsed.projectId = parsed.project_id;
    }
    if (typeof parsed.client_email === 'string') {
      parsed.clientEmail = parsed.client_email;
    }
    return parsed;
  }

  // Fallback: split env vars.
  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    project_id: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY) : undefined,
    private_key: process.env.FIREBASE_PRIVATE_KEY ? normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY) : undefined,
  };
}

const serviceAccount = loadServiceAccountFromEnv();
const missing = [
  !(serviceAccount.projectId || serviceAccount.project_id)
    ? 'FIREBASE_PROJECT_ID (or service account project_id)'
    : null,
  !(serviceAccount.clientEmail || serviceAccount.client_email)
    ? 'FIREBASE_CLIENT_EMAIL (or service account client_email)'
    : null,
  !(serviceAccount.privateKey || serviceAccount.private_key)
    ? 'FIREBASE_PRIVATE_KEY (or service account private_key)'
    : null,
].filter(Boolean) as string[];

if (!admin.apps.length) {
  if (missing.length) {
    throw new Error(
      `Firebase Admin credentials missing: ${missing.join(', ')}. ` +
        `Set FIREBASE_SERVICE_ACCOUNT_JSON (recommended) or FIREBASE_SERVICE_ACCOUNT_BASE64, ` +
        `or the split FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY env vars.`,
    );
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } catch (e) {
    const err = e as Error;
    throw new Error(`Failed to initialize Firebase Admin: ${err.message}`);
  }
}

export const db = admin.firestore();
export const firestore = admin.firestore();

export { admin }; 