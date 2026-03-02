import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './reports/Models/reports.module';
import { StationsModule } from './stations/Models/stations.module';
// import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './Users/users.module';
import { ServicesModule } from './Supervisor/supervisor.module';

@Module({
  imports: [ReportModule, StationsModule, UsersModule, AdminModule,ServicesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
