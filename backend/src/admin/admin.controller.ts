import { Controller, Post, Body } from '@nestjs/common';
import { admin } from '../firebase/firebase-admin';

@Controller('admin')
export class AdminController {
  @Post('add-supervisor')
  async addSupervisor(@Body() body: { fullName: string; email: string; password: string; phone?: string; stations?: string[] }) {
    const { fullName, email, password, phone, stations } = body;

    if (!fullName || !email || !password) {
      return { error: "Missing required fields" };
    }

    try {
      const userRecord = await admin.auth().createUser({ 
        email, 
        password, 
        displayName: fullName 
      });
      const uid = userRecord.uid;

      await admin.auth().setCustomUserClaims(uid, { role: "supervisor" });

      await admin.firestore().collection("users").doc(uid).set({
        id: uid,
        fullName,
        email,
        phone,
        role: "Supervisor",
        stationScope: stations || [],
        createdAt: new Date().toISOString(),
      });

      return { 
        message: "Supervisor added successfully", 
        uid 
      };
    } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Failed to create supervisor:', err.message);
    } else {
      console.error('Failed to create supervisor:', err);
    }
     
  }
  }
}
