// import { Injectable } from '@nestjs/common';
// import { CreateReportDto } from '../dto/CreateReportDto';
// import { admin, db } from '../../../src/firebase/firebase-admin';

// @Injectable()
// export class ReportsService {
//   private reportsCollection = db.collection('reports');

//   async createReport(dto: CreateReportDto) {
//     const newReport = {
//       ...dto,
//       status: 'new',
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     };

//     const docRef = await this.reportsCollection.add(newReport);

//     return { id: docRef.id };
//   }

//   async getReportsByUser(userId: string) {
//     const snapshot = await this.reportsCollection
//       .where('reporterId', '==', userId)
//       .orderBy('createdAt', 'desc')
//       .get();
//     const reports: Report[] = [];
//     snapshot.forEach((doc) => {
//       reports.push({ id: doc.id, ...doc.data() } as unknown as Report);
//     });
//     return reports;
//   }
// }
import { Injectable } from '@nestjs/common';
import { CreateReportDto } from '../dto/CreateReportDto';
import { admin, db } from '../../../src/firebase/firebase-admin';

@Injectable()
export class ReportsService {
  private reportsCollection = db.collection('reports');
  private reportEventsCollection = db.collection('report_events'); // 👈 جديد

  // =====================================================
  // 🔥 Helper لتسجيل أي Event
  // =====================================================
  private async logEvent(data: {
    reportId: string;
    action: 'created' | 'status_change' | 'assignment' | 'comment';
    actorId: string;
    fromStatus?: string;
    toStatus?: string;
    note?: string;
  }) {
    await this.reportEventsCollection.add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // =====================================================
  // ✅ Create Report + Log Event
  // =====================================================
  async createReport(dto: CreateReportDto) {
    const newReport = {
      ...dto,
      status: 'new',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await this.reportsCollection.add(newReport);

    // 👇 تسجيل Event بعد الإنشاء
    await this.logEvent({
      reportId: docRef.id,
      action: 'created',
      actorId: dto.reporterId,
    });

    return { id: docRef.id };
  }

  // =====================================================
  // ✅ Get Reports By User
  // =====================================================
  async getReportsByUser(userId: string) {
    const snapshot = await this.reportsCollection
      .where('reporterId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const reports: Report[] = [];

    snapshot.forEach((doc) => {
      reports.push({ id: doc.id, ...doc.data() } as unknown as Report);
    });

    return reports;
  }

  // =====================================================
  // ✅ Update Status + Log Event
  // =====================================================
  async updateStatus(reportId: string, newStatus: string, actorId: string) {
    const doc = await this.reportsCollection.doc(reportId).get();

    if (!doc.exists) throw new Error('Report not found');

    const docData = doc.data();
    if (!docData) throw new Error('Report data not found');
    
    const oldStatus = docData.status;

    await this.reportsCollection.doc(reportId).update({
      status: newStatus,
    });

    await this.logEvent({
      reportId,
      action: 'status_change',
      actorId,
      fromStatus: oldStatus,
      toStatus: newStatus,
    });

    return { success: true };
  }

  // =====================================================
  // ✅ Assign Technician + Log Event
  // =====================================================
  async assignReport(
    reportId: string,
    userId: string,
    actorId: string,
  ) {
    await this.reportsCollection.doc(reportId).update({
      assignedToUserId: userId,
      status: 'assigned',
    });

    await this.logEvent({
      reportId,
      action: 'assignment',
      actorId,
      note: `Assigned to ${userId}`,
    });

    return { success: true };
  }

  // =====================================================
  // ✅ Add Comment + Log Event
  // =====================================================
  async addComment(
    reportId: string,
    comment: string,
    actorId: string,
  ) {
    const commentObj = {
      comment,
      actorId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await this.reportsCollection.doc(reportId).update({
      comments: admin.firestore.FieldValue.arrayUnion(commentObj),
    });

    await this.logEvent({
      reportId,
      action: 'comment',
      actorId,
      note: comment,
    });

    return { success: true };
  }
}
