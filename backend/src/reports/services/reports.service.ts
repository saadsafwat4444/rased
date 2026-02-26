import { Injectable } from '@nestjs/common';
import { CreateReportDto } from '../dto/CreateReportDto';
import { admin, db } from '../../../src/firebase/firebase-admin';

@Injectable()
export class ReportsService {
  private reportsCollection = db.collection('reports');

  async createReport(dto: CreateReportDto) {
    const newReport = {
      ...dto,
      status: 'new',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await this.reportsCollection.add(newReport);

    return { id: docRef.id };
  }

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
}
