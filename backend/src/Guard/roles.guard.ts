import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { admin } from '../../src/firebase/firebase-admin';

interface MyDecodedIdToken {
  uid: string;
  email?: string;
  role?: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private allowedRoles: string[]) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      user?: MyDecodedIdToken;
    }>();

    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new ForbiddenException('No token provided');

    const token = authHeader.split(' ')[1];

    try {
      const decoded = (await admin
        .auth()
        .verifyIdToken(token)) as MyDecodedIdToken;

      if (!this.allowedRoles.includes(decoded.role ?? 'user')) {
        throw new ForbiddenException('Access forbidden');
      }

      // اضف الـ decoded token للـ request
      request.user = decoded;

      return true;
    } catch (err) {
      throw new ForbiddenException('Invalid token or insufficient permissions');
    }
  }
}
