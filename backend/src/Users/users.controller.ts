import { Controller, Get } from '@nestjs/common';
import { admin } from '../firebase/firebase-admin';

interface FirestoreUser {
  id: string;
  source: string;
  email?: string;
  uid?: string;
  fullName?: string;
  phone?: string;
  stationScope?: string[];
  role?: string;
}

interface AuthUser {
  uid: string;
  email?: string;
  displayName?: string;
  role: string;
  source: string;
  phone?: string | null;
  phoneNumber?: string | null; // Firebase Auth phone number
}

@Controller('users')
export class UsersController {
  @Get()
  async getAllUsers() {
    try {
      // Fetch all Firebase Auth users
      const listUsersResult = await admin.auth().listUsers();
      const authUsers: AuthUser[] = listUsersResult.users.map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: 'User', // Default role for Auth users
        source: 'auth',
        phone: user.phoneNumber || null,
        // phoneNumber: user.phoneNumber || null,
      }));

      // Fetch Firestore users to get phone numbers for auth users
      const usersSnapshot = await admin.firestore().collection('users').get();
      const firestoreUsers: FirestoreUser[] = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        source: 'firestore',
        ...doc.data(),
      }));

      // Create a map of emails to phone numbers from Firestore
      const emailToPhoneMap = new Map();
      firestoreUsers.forEach(fsUser => {
        if (fsUser.email && fsUser.phone) {
          emailToPhoneMap.set(fsUser.email, fsUser.phone);
          console.log(`Firestore user ${fsUser.email} has phone: ${fsUser.phone}`);
        }
      });
      
      console.log("Email to Phone Map:", Object.fromEntries(emailToPhoneMap));

      // Combine and deduplicate users
      const allUsers: any[] = [];
      const seenEmails = new Set();
      
      // Add Firestore users first
      firestoreUsers.forEach(fsUser => {
        if (fsUser.email && !seenEmails.has(fsUser.email)) {
          allUsers.push(fsUser);
          seenEmails.add(fsUser.email);
        }
      });
      
      // Add Auth users that aren't already added, with phone from Firestore if available
      authUsers.forEach(authUser => {
        if (authUser.email && !seenEmails.has(authUser.email)) {
          const phoneFromFirestore = emailToPhoneMap.get(authUser.email);
          const finalPhone = phoneFromFirestore || authUser.phoneNumber || 'No phone';
          console.log(`Auth user ${authUser.email}: phoneFromFirestore=${phoneFromFirestore}, authUser.phoneNumber=${authUser.phoneNumber}, finalPhone=${finalPhone}`);
          
          allUsers.push({
            ...authUser,
            id: authUser.uid,
            fullName: authUser.displayName || authUser.email?.split('@')[0] || 'Unknown',
            phone: finalPhone,
            stationScope: [],
            role: 'User',
          });
          seenEmails.add(authUser.email);
        }
      });

      return { users: allUsers };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }
}
