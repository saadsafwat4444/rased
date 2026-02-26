export class CreateReportDto {
  description!: string;
  category!: string;
  severity!: string;
  stationId!: string;
  lat!: number;
  lng!: number;
  locationName!: string;
  mediaUrls!: string[];
  reporterId!: string;
  createdAt!: any;
}
