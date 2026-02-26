import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';
// const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const db = admin.firestore();
export { admin };
