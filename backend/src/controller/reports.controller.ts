import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';

import { AuthGuard } from 'src/Guard/auth.guard';
import { RolesGuard } from 'src/Guard/roles.guard';
import { RequestWithUser } from 'src/interface/RequestWithUser';
import { CreateReportDto } from 'src/reports/dto/CreateReportDto';
import { ReportsService } from 'src/reports/services/reports.service';

@Controller('reports')
@UseGuards(new RolesGuard(['user']))
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
  @UseGuards(AuthGuard)
  @Post()
  async createReport(
    @Body() dto: CreateReportDto,
    @Req() req: RequestWithUser,
  ) {
    dto.reporterId = req.user.uid;
    return this.reportsService.createReport(dto);
  }
  @Get('my')
  @UseGuards(AuthGuard)
  async getMyReports(@Req() req: RequestWithUser) {
    const userId = req.user.uid;
    const reports = await this.reportsService.getReportsByUser(userId);
    return Array.isArray(reports) ? reports : [];
  }
}
