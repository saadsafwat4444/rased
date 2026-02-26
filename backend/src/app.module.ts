import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './reports/Models/reports.module';
import { StationsModule } from './stations/Models/stations.module';

@Module({
  imports: [ReportModule, StationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
