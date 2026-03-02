import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException, 
  NotFoundException
} from '@nestjs/common';
import { admin, firestore } from '../../firebase/firebase-admin';

interface CreateSupervisorDto {
  fullName: string;
  email: string;
 
  password: string;
  phone?: string;
  stations?: string[];
}

interface Report {
  id: string;
   

  [key: string]: any;
}

@Injectable()
export class SupervisorService {
  private db = admin.firestore();

  async createSupervisor(dto: CreateSupervisorDto) {
    const { fullName, email, password, phone, stations } = dto;

    console.log('CreateSupervisor DTO:', dto);
    console.log('Stations received:', stations);

    if (!fullName || !email || !password) {
      throw new BadRequestException('Missing required fields');
    }

    try {
      // 1️⃣ إنشاء المستخدم في Firebase Auth
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: fullName,
      });

      const uid = userRecord.uid;

      // 2️⃣ استلام station IDs مباشرة من الفرونت
      const stationIds: string[] = Array.isArray(stations) ? stations : [];

      if (stationIds.length === 0) {
        throw new BadRequestException(
          'Supervisor must have at least one station',
        );
      }

      // 3️⃣ إضافة Custom Claims
      const customClaims = {
        role: 'supervisor',
        stationScope: stationIds,
      };

      console.log('Custom claims to set:', customClaims);
      
      await admin.auth().setCustomUserClaims(uid, customClaims);

      // 4️⃣ حفظ المستخدم في Firestore
      await firestore
        .collection('users')
        .doc(uid)
        .set({
          id: uid,
          fullName,
          email,
          phone: phone || null,
          role: 'Supervisor',
          stationScope: stationIds,
          createdAt: new Date().toISOString(),
        });

      return { message: 'Supervisor added successfully', uid };
    } catch (err: unknown) {
      console.error('Error creating supervisor:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to create supervisor: ' + message,
      );
    }
  }

  // جلب كل المستخدمين
  async getAllUsers() {
    try {
      const snapshot = await firestore.collection('users').get();
      return snapshot.docs.map((doc) => doc.data());
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  // تعديل الدور
  async updateUserRole(uid: string, role: string) {
    if (!role) throw new BadRequestException('Role is required');

    try {
      // تحديث Firebase Auth
      await admin.auth().setCustomUserClaims(uid, { role });

      // تحديث Firestore فقط إذا كان المستخدم موجوداً
      const userDoc = await firestore.collection('users').doc(uid).get();
      if (userDoc.exists) {
        await firestore.collection('users').doc(uid).update({ role });
      }

      return { message: 'User role updated successfully' };
    } catch (err: unknown) {
      console.error('Error updating user role:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      throw new InternalServerErrorException(
        'Failed to update role: ' + errorMessage,
      );
    }
  }

  // حذف مستخدم
  async deleteUser(uid: string) {
    try {
      await admin.auth().deleteUser(uid);
      await firestore.collection('users').doc(uid).delete();
      return { message: 'User deleted successfully' };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  //  async getReportsForUser(user: any, status?: string) {
  //   console.log('getReportsForUser called with user:', user);
  //   console.log('User stationScope:', user.stationScope);
    
  //   const reportsRef = this.db.collection('reports');

  //   // 👑 Admin
  //   if (user.role === 'admin') {
  //     let query = reportsRef as any;
  //     if (status) query = query.where('status', '==', status);
  //     const snap = await query.get();
  //     return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  //   }

  //   // 👨‍💼 Supervisor
  //   if (user.role === 'supervisor') {
  //     const scopes: string[] = user.stationScope || [];
  //     console.log('Supervisor scopes:', scopes);
  //     if (scopes.length === 0) {
  //       console.log('No station scopes, returning empty array');
  //       return [];
  //     }

  //     const chunks: string[][] = [];
  //     for (let i = 0; i < scopes.length; i += 10) {
  //       chunks.push(scopes.slice(i, i + 10));
  //     }

  //     const results: Report[] = [];
  //     for (const chunk of chunks) {
  //       let query = reportsRef as any;
  //       query = query.where('stationId', 'in', chunk);
  //       if (status) query = query.where('status', '==', status);

  //       const snap = await query.get();
  //       results.push(...snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  //     }

  //     return results;
  //   }

  //   // 👤 User
  //   let query = reportsRef as any;
  //   query = query.where('reporterId', '==', user.id);
  //   if (status) query = query.where('status', '==', status);
  //   const snap = await query.get();
  //   return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  // }

  async getReportsForUser(user: any, status?: string) {
  console.log('getReportsForUser called with user:', user);
  console.log('User role:', user.role);
  console.log('User stationScope:', user.stationScope);
  const role = (user.role || '').toLowerCase();

  const reportsRef = this.db.collection('reports');

  // 👑 Admin: يشوف كل البلاغات
  if (role === 'admin') {
    let query: FirebaseFirestore.Query = reportsRef;
    if (status) query = query.where('status', '==', status);
    query = query.orderBy('createdAt', 'desc'); // أحدث البلاغات أولاً

    const snap = await query.get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  // 👨‍💼 Supervisor: حسب stationScope
  if (role === 'supervisor') {
    const scopes: string[] = (user.stationScope || []).map(String); // force string
    console.log('Supervisor scopes (as strings):', scopes);
    console.log('Number of scopes:', scopes.length);

    if (scopes.length === 0) {
      console.log('No station scopes found for supervisor');
      return [];
    }

    const chunks: string[][] = [];
    for (let i = 0; i < scopes.length; i += 10) {
      chunks.push(scopes.slice(i, i + 10));
    }

    const results: Report[] = [];

    for (const chunk of chunks) {
      console.log('Processing chunk:', chunk);
      let query: FirebaseFirestore.Query = reportsRef;
      query = query.where('stationId', 'in', chunk.map(String));
      if (status) query = query.where('status', '==', status);
      query = query.orderBy('createdAt', 'desc'); // أحدث البلاغات أولاً

      const snap = await query.get();
      const chunkResults = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      console.log('Chunk results count:', chunkResults.length);
      results.push(...chunkResults);
    }

    console.log('Total results found:', results.length);

    console.log('Fetched reports for supervisor:', results.map(r => r.stationId));

    // Optional: ترتيب إضافي على الكود لو حابب
    results.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });

    return results;
  }

  // 👤 User العادي: فقط بلاغاته
  if (user.role === 'user') {
    let query: FirebaseFirestore.Query = reportsRef.where('reporterId', '==', user.id);
    if (status) query = query.where('status', '==', status);
    query = query.orderBy('createdAt', 'desc');

    const snap = await query.get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  // Default case: no matching role
  console.log('Unknown user role or no permissions:', user.role);
  return [];
}
 

  async updateReportStatus(
    reportId: string,
    status: string,
    user: any,
  ) {
    const allowedStatuses = ['new', 'in_review', 'assigned', 'resolved'];

    if (!allowedStatuses.includes(status)) {
      throw new ForbiddenException('Invalid status value');
    }

    const reportRef = admin.firestore().collection('reports').doc(reportId);
    const reportSnap = await reportRef.get();

    if (!reportSnap.exists) {
      throw new NotFoundException('Report not found');
    }

    const reportData = reportSnap.data();

    if (!reportData) {
      throw new NotFoundException('Report data not found');
    }

    // 🔐 لو supervisor لازم يكون البلاغ في نطاقه
    if (user.role === 'supervisor') {
      const stationScope = user.stationScope || [];

      if (!stationScope.includes(reportData.stationId)) {
        throw new ForbiddenException(
          'You cannot update reports outside your station scope',
        );
      }
    }

    // 🔐 user العادي ممنوع
    if (user.role === 'user') {
      throw new ForbiddenException('Users cannot update report status');
    }

    await reportRef.update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { message: 'Report status updated successfully' };
  }
}
