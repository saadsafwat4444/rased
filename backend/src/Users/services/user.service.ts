// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { admin } from '../../../src/firebase/firebase-admin'; // import admin SDK

@Injectable()
export class UsersService {
  async setUserRole(uid: string, role: 'admin' | 'supervisor' | 'user') {
    try {
      await admin.auth().setCustomUserClaims(uid, { role });
      console.log(`User ${uid} role set to ${role}`);
      return { success: true };
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, error: message };
    }
  }
}
