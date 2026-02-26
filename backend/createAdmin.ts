// createAdmin.ts
// import { admin, db } from '';

import { admin, db } from './firebase/firebase-admin';

// import { admin, db } from 'firebase/firebase-admin';

async function createAdmin() {
  try {
    // 1️⃣ إنشاء حساب Admin في Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: 'admin@example.com',
      password: 'StrongTempPassword123!',
      displayName: 'Super Admin',
    });

    console.log('Admin UID:', userRecord.uid);

    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });

    // 2️⃣ حفظ بياناته في Firestore
    await db.collection('users').doc(userRecord.uid).set({
      id: userRecord.uid,
      fullName: 'Super Admin',
      phone: '+201234567890',

      stationScopes: [],
      createdAt: new Date().toISOString(),
    });

    console.log('Admin added successfully!');
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Failed to create admin:', err.message);
    } else {
      console.error('Failed to create admin:', err);
    }
  }
}

// نفذ الكود
createAdmin();
