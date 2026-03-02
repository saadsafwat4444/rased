import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import admin from 'firebase-admin';
import { RequestWithUser } from 'src/interface/RequestWithUser';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req: RequestWithUser = context
      .switchToHttp()
      .getRequest<RequestWithUser>();
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) return false;

    try {
      const decoded = await admin.auth().verifyIdToken(token);
      console.log('Decoded token:', decoded);
      console.log('User stationScopes in token:', decoded.stationScopes);
      req.user = decoded;
      return true;
    } catch (err: any) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
