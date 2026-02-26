import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { StationsService } from '../services/stations.service';
import { CreateStationDto } from '../dto/create-station.dto';
import { UpdateStationDto } from '../dto/update-station.dto';
import { RolesGuard } from 'src/Guard/roles.guard';

@Controller('stations')
@UseGuards(new RolesGuard(['admin']))
export class StationsController {
  constructor(private readonly service: StationsService) {}

  // ✅ CREATE
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateStationDto) {
    return this.service.create(dto);
  }

  // ✅ GET ALL
  @Get()
  findAll(@Query('region') region?: string) {
    return this.service.findAll(region);
  }

  // ✅ GET ONE
  @Get(':stationNumber')
  findOne(@Param('stationNumber') stationNumber: string) {
    return this.service.findOne(stationNumber);
  }

  // ✅ UPDATE
  @Patch(':stationNumber')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('stationNumber') stationNumber: string,
    @Body() dto: UpdateStationDto,
  ) {
    return this.service.update(stationNumber, dto);
  }

  // ✅ DELETE
  @Delete(':stationNumber')
  remove(@Param('stationNumber') stationNumber: string) {
    return this.service.remove(stationNumber);
  }
}
