import { Module } from '@nestjs/common';
 
import { SupervisorController } from './controller/supervisor.controller';
import { SupervisorService } from './services/supervisor.service';

@Module({
  controllers: [SupervisorController],
  providers: [SupervisorService],
})
export class ServicesModule {}