import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application } from '../../../Domain/entities/application.entity';
import { IApplicationRepository } from '../../../Domain/repositories/application-repository.interface';

@Injectable()
export class ApplicationRepository implements IApplicationRepository {
  constructor(
    @InjectModel('Application') private readonly applicationModel: Model<Application>
  ) {}

  async create(application: Application): Promise<Application> {
    const newApplication = new this.applicationModel(application);
    return await newApplication.save();
  }

  async findById(id: string): Promise<Application | null> {
    return await this.applicationModel.findOne({ id }).exec();
  }

  async findAll(): Promise<Application[]> {
    return await this.applicationModel.find().exec();
  }

  async update(id: string, application: Partial<Application>): Promise<Application> {
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
