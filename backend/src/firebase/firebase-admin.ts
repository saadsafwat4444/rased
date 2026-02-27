import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  // Try environment variables first (for production)
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    // Production mode - use environment variables
    const serviceAccount = {
      project_id: projectId,
      client_email: clientEmail,
      private_key: privateKey,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } else {
    // Development mode - use local service account file
    try {
      const serviceAccount = require('./serviceAccountKey.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error('Missing Firebase credentials. Please either:');
      console.error('1. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables (for production)');
      console.error('2. Add serviceAccountKey.json file in src/firebase/ (for development)');
      process.exit(1);
    }
  }
}

export const db = admin.firestore();
export { admin };
