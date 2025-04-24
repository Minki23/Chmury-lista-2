import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApplicationInfo } from '../../../Domain/entities/application-info.entity';
import { IScoringRepository } from '../../../Domain/repositories/scoring-repository.interface';

@Injectable()
export class ScoringRepository implements IScoringRepository {
  private readonly logger = new Logger('ScoringRepository');
  constructor(
    @InjectModel('ScoredApplications') private readonly applicationModel: Model<ApplicationInfo>
  ) {}

  async create(application: ApplicationInfo): Promise<ApplicationInfo> {
    const newApplication = new this.applicationModel(application);
    return await newApplication.save();
  }

  async findById(id: string): Promise<ApplicationInfo | null> {
    return await this.applicationModel.findOne({ id }).exec();
  }

  async findAll(): Promise<ApplicationInfo[]> {
    return await this.applicationModel.find().exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.applicationModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }
}
