import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPositionsRepository } from '../../../Domain/repositories/position-repository.interface';
import { PositionInfo } from 'src/Domain/entities/positions-info.entity';

@Injectable()
export class PositionsRepository implements IPositionsRepository {
  private readonly logger = new Logger('PositionsRepository');
  constructor(
    @InjectModel('StoredPositions') private readonly positionsModel: Model<PositionInfo>
  ) {}

  async add(position: PositionInfo): Promise<PositionInfo> {
    this.logger.log(`Adding position: ${JSON.stringify(position)}`);
    const newPosition = new this.positionsModel(position);
    return await newPosition.save();
  }

  async findByPosition(position): Promise<PositionInfo | null> {
    const positionData = await this.positionsModel.findOne({ name: position }).exec();
    if (!positionData) {
      this.logger.error(`Position ${position} not found`);
      return null;
    }
    this.logger.log(`Position retrieved: ${JSON.stringify(positionData)}`);
    return positionData;
  }

  async delete(position: string): Promise<boolean> {
    const result = await this.positionsModel.deleteOne({ name: position }).exec();
    if (result.deletedCount === 0) {
      this.logger.error(`Position ${position} not found`);
      return false;
    }
    return true;
  }
}
