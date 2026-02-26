import * as functions from 'firebase-functions';
import { admin } from '../src/firebase/firebase-admin';

// TypeScript + ESLint-safe Cloud Function
export const assignUserRole = functions.auth
  .user()
  .onCreate(async (user: functions.auth.UserRecord) => {
    try {
      const uid: string = String(user.uid);
      await admin.auth().setCustomUserClaims(uid, { role: 'user' });
      console.log(`Assigned role 'user' to ${uid}`);
    } catch (err: unknown) {
      console.error('Error assigning role to user', err);
    }
  });
