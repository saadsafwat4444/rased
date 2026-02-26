import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { CreateStationDto } from '../dto/create-station.dto';
import { UpdateStationDto } from '../dto/update-station.dto';

@Injectable()
export class StationsService {
  private db = firestore();
  private collection = this.db.collection('stations');

  async create(dto: CreateStationDto) {
    const stationRef = this.collection.doc(dto.stationNumber);

    const existing = await stationRef.get();

    if (existing.exists) {
      throw new BadRequestException('Station number already exists');
    }

    await stationRef.set({
      name: dto.name,
      region: dto.region,
      location: {
        lat: dto.lat,
        lng: dto.lng,
      },
      address: dto.address,
      statusMeta: dto.statusMeta || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      message: 'Station created successfully',
      id: dto.stationNumber,
    };
  }

  // ✅ GET ALL
  async findAll(region?: string) {
    let query = this.collection as FirebaseFirestore.Query;

    if (region) {
      query = query.where('region', '==', region);
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // ✅ GET ONE
  async findOne(stationNumber: string) {
    const doc = await this.collection.doc(stationNumber).get();

    if (!doc.exists) {
      throw new NotFoundException('Station not found');
    }

    return {
      id: doc.id,
      ...doc.data(),
    };
  }

  // ✅ UPDATE
  async update(stationNumber: string, dto: UpdateStationDto) {
    const stationRef = this.collection.doc(stationNumber);

    const existing = await stationRef.get();

    if (!existing.exists) {
      throw new NotFoundException('Station not found');
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (dto.name) updateData.name = dto.name;
    if (dto.region) updateData.region = dto.region;
    if (dto.address) updateData.address = dto.address;

    if (dto.lat && dto.lng) {
      updateData.location = {
        lat: dto.lat,
        lng: dto.lng,
      };
    }

    if (dto.statusMeta) {
      updateData.statusMeta = dto.statusMeta;
    }

    await stationRef.update(updateData);

    return { message: 'Station updated successfully' };
  }

  // ✅ DELETE
  async remove(stationNumber: string) {
    const stationRef = this.collection.doc(stationNumber);

    const existing = await stationRef.get();

    if (!existing.exists) {
      throw new NotFoundException('Station not found');
    }

    await stationRef.delete();

    return { message: 'Station deleted successfully' };
  }
}
