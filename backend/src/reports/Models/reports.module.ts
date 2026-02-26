import { Module } from '@nestjs/common';
import { ReportsController } from 'src/controller/reports.controller';
import { ReportsService } from '../services/reports.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportModule {}
