// src/users/users.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { RolesGuard } from 'src/Guard/roles.guard';

@Controller('users')
@UseGuards(new RolesGuard(['admin']))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('set-role')
  async setRole(
    @Body() body: { uid: string; role: 'admin' | 'supervisor' | 'user' },
  ) {
    const { uid, role } = body;
    return this.usersService.setUserRole(uid, role);
  }
}
