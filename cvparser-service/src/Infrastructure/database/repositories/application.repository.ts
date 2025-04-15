import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApplicationInfo } from '../../../Domain/entities/applicationInfo.entity';
import { IApplicationRepository } from '../../../Domain/repositories/application-repository.interface';

@Injectable()
export class ApplicationRepository implements IApplicationRepository {
  private readonly logger = new Logger('ApplicationRepository');
  constructor(
    @InjectModel('ParsedApplications') private readonly applicationModel: Model<ApplicationInfo>
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

  async update(id: string, application: Partial<ApplicationInfo>): Promise<ApplicationInfo> {
    const updated = await this.applicationModel.findOneAndUpdate(
      { id },
      { ...application, updatedAt: new Date() },
      { new: true }
    ).exec();
    
    if (!updated) {
      throw new Error(`Application with ID ${id} not found`);
    }
    
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.applicationModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }
}
