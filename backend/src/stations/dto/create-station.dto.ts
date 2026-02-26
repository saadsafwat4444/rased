import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStationDto {
  @IsString()
  stationNumber!: string;

  @IsString()
  name!: string;

  @IsString()
  region!: string;

  @Type(() => Number)
  @IsNumber()
  lat!: number;

  @Type(() => Number)
  @IsNumber()
  lng!: number;

  @IsString()
  address!: string;

  @IsOptional()
  statusMeta?: {
    healthStatus?: 'good' | 'warning' | 'critical';
    lastInspectionAt?: Date;
  };
}
