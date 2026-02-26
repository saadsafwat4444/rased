import { Module } from '@nestjs/common';
import { StationsService } from '../services/stations.service';
import { StationsController } from '../controller/stations.controller';

@Module({
  controllers: [StationsController],
  providers: [StationsService],
})
export class StationsModule {}
