 
import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { SupervisorService } from '../services/supervisor.service';
import { AuthGuard } from 'src/Guard/auth.guard';
import { admin, firestore } from '../../firebase/firebase-admin';
import { InternalServerErrorException } from '@nestjs/common';


interface AddCommentDto {
  comment: string;
}


interface AssignDto {
  userId: string; // الفني الذي سيتم التعيين له
  email?: string; // Optional email for fallback
}

interface RequestWithUser extends Request {
  user: {
    uid: string;
    fullName: string;
    stationScope: string[];
  };
}

interface CreateSupervisorDto {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  stations?: string[];
}

@Controller('users') // endpoint base يكون /users
export class SupervisorController {
  constructor(private readonly supervisorService: SupervisorService) {}

  @Post('add-supervisor')
  async addSupervisor(@Body() dto: CreateSupervisorDto) {
    return this.supervisorService.createSupervisor(dto);
  }

  @Get()
  async getUsers() {
    return this.supervisorService.getAllUsers();
  }

  @Patch(':uid/role')
  async editRole(@Param('uid') uid: string, @Body('role') role: string) {
    return this.supervisorService.updateUserRole(uid, role);
  }

  @Delete(':uid')
  async deleteUser(@Param('uid') uid: string) {
    console.log('Delete user request received with UID:', uid);
    try {
      await admin.auth().deleteUser(uid);
      await firestore.collection('users').doc(uid).delete();
      return { message: 'User deleted successfully' };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  @UseGuards(AuthGuard)
  @Get('reports')
  async getReports(@Req() req: any, @Query('status') status?: string) {
    console.log('User object in reports endpoint:', req.user);
    console.log('User stationScope:', req.user.stationScope);
    
    // 1️⃣ جلب بيانات المستخدم الكاملة من Firestore
    const userDoc = await firestore.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists) {
      throw new InternalServerErrorException('User not found in database');
    }
    
    const userData = userDoc.data();
    console.log('Full user data from Firestore:', userData);
    
    if (!userData) {
      throw new InternalServerErrorException('User data is null or undefined');
    }
    
    // 2️⃣ دمج البيانات
    const fullUser = {
      ...req.user,
      ...userData,
      stationScope: userData.stationScope || []
    };
    
    console.log('Merged user object:', fullUser);
    return this.supervisorService.getReportsForUser(fullUser, status);
  }

  @UseGuards(AuthGuard)
  @Patch('reports/:id/status')
  async updateReportStatus(
    @Param('id') reportId: string,
    @Body('status') status: string,
    @Req() req: any,
  ) {
    return await this.supervisorService.updateReportStatus(
      reportId,
      status,
      req.user,
    );
  }
  @UseGuards(AuthGuard)
  @Post('reports/:id/comments')
  async addComment(
    @Param('id') reportId: string,
    @Body() dto: AddCommentDto,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user;

    try {
      // 1️⃣ جلب بيانات المستخدم الكاملة من Firestore
      const userDoc = await firestore.collection('users').doc(user.uid).get();
      if (!userDoc.exists) {
        throw new InternalServerErrorException('User not found in database');
      }
      
      const userData = userDoc.data();
      if (!userData || !userData.stationScope || !userData.fullName) {
        throw new InternalServerErrorException('User data is incomplete');
      }

      // 2️⃣ جلب التقرير
      const reportRef = firestore.collection('reports').doc(reportId);
      const reportSnap = await reportRef.get();

      if (!reportSnap.exists) {
        throw new InternalServerErrorException('Report not found');
      }

      const reportData = reportSnap.data();

      if (!reportData) {
        throw new InternalServerErrorException('Report data is empty');
      }

      // 3️⃣ تحقق من stationScope
      if (!userData.stationScope.includes(reportData.stationId)) {
        throw new InternalServerErrorException(
          'You do not have permission to comment on this report',
        );
      }

      // 4️⃣ إضافة التعليق في subcollection
      const commentData = {
        comment: dto.comment,
        userId: user.uid,
        fullName: userData.fullName,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await reportRef.collection('comments').add(commentData);

      // 5️⃣ تسجيل الحدث في report_events
      const eventData = {
        reportId,
        userId: user.uid,
        fullName: userData.fullName,
        type: 'comment',
        comment: dto.comment,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await firestore.collection('report_events').add(eventData);

      return { message: 'Comment added successfully' };
    } catch (err) {
      console.error('Error adding comment:', err);
      throw new InternalServerErrorException('Failed to add comment');
    }
  }

    @UseGuards(AuthGuard)
  @Patch('reports/:id/assign')
  async assignReport(
    @Param('id') reportId: string,
    @Body() dto: AssignDto,
    @Req() req: RequestWithUser,
  ) {
    try {
      const supervisor = req.user;

      // 1️⃣ جلب بيانات السوبرفايزر الكاملة من Firestore
      const supervisorDoc = await firestore.collection('users').doc(supervisor.uid).get();
      if (!supervisorDoc.exists) {
        throw new InternalServerErrorException('Supervisor not found in database');
      }
      
      const supervisorData = supervisorDoc.data();
      if (!supervisorData || !supervisorData.stationScope) {
        throw new InternalServerErrorException('Supervisor data is incomplete');
      }

      // 2️⃣ تحقق من البلاغ
      const reportRef = firestore.collection('reports').doc(reportId);
      const reportSnap = await reportRef.get();

      if (!reportSnap.exists) {
        throw new InternalServerErrorException('Report not found');
      }

      const reportData = reportSnap.data();
      if (!reportData) {
        throw new InternalServerErrorException('Report data malformed');
      }

      // 3️⃣ تحقق أن السوبرفايزر يملك الصلاحية على هذه المحطة
      if (!supervisorData.stationScope.includes(reportData.stationId)) {
        throw new InternalServerErrorException('You cannot assign reports for this station');
      }

      // 4️⃣ تحقق من أن الـ user موجود وفني
      console.log('Looking for user with ID:', dto.userId);
      let userRecord;
      
      try {
        // First try Firebase Auth
        userRecord = await admin.auth().getUser(dto.userId);
        console.log('User found in Firebase Auth:', userRecord.email);
      } catch (authError) {
        console.log('User not found in Firebase Auth, trying Firestore');
        
        // If not found in Auth, try Firestore
        let userSnap;
        const userRef = firestore.collection('users').doc(dto.userId);
        userSnap = await userRef.get();
        
        // If not found, try by email
        if (!userSnap.exists && dto.email) {
          console.log('User not found by ID, trying email:', dto.email);
          const emailQuery = await firestore.collection('users').where('email', '==', dto.email).get();
          if (!emailQuery.empty) {
            userSnap = emailQuery.docs[0];
            console.log('User found by email in Firestore:', userSnap.id);
          }
        }

        if (!userSnap.exists) {
          console.log('User not found in Firestore with ID:', dto.userId);
          throw new InternalServerErrorException('Assigned user not found');
        }

        const userData = userSnap.data();
        if (!userData || userData.role !== 'user') {
          throw new InternalServerErrorException('Assigned user must be a technician');
        }
        
        // User found in Firestore, continue
        return await this.completeAssignment(reportId, dto.userId, reportData, supervisor.uid);
      }

      // User found in Firebase Auth, check if they exist in Firestore
      const userDoc = await firestore.collection('users').doc(dto.userId).get();
      if (!userDoc.exists) {
        console.log('User exists in Auth but not in Firestore, creating record...');
        // Create user in Firestore
        await firestore.collection('users').doc(dto.userId).set({
          id: dto.userId,
          email: userRecord.email,
          fullName: userRecord.displayName || userRecord.email,
          role: 'user', // Default role for technicians
          createdAt: new Date().toISOString(),
        });
      }

      const userData = (await firestore.collection('users').doc(dto.userId).get()).data();
      if (!userData || userData.role !== 'user') {
        throw new InternalServerErrorException('Assigned user must be a technician');
      }

      return await this.completeAssignment(reportId, dto.userId, reportData, supervisor.uid);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to assign report');
    }
  }

  private async completeAssignment(reportId: string, userId: string, reportData: any, supervisorId: string) {
    // 5️⃣ تحديث البلاغ
    await firestore.collection('reports').doc(reportId).update({
      assignedToUserId: userId,
      status: 'assigned',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 6️⃣ تسجيل الحدث في report_events
    const eventData = {
      reportId,
      action: 'assignment',
      fromStatus: reportData.status,
      toStatus: 'assigned',
      actorId: supervisorId,
      assignedToUserId: userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await firestore.collection('report_events').add(eventData);

    return { message: 'Report assigned successfully' };
  }
}
 


