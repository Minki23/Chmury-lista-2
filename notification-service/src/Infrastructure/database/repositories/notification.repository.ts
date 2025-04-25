import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INotificationRepository } from 'src/Domain/repositories/notification-repository.interface';
import { NotificationInfo } from 'src/Domain/entities/notification-info.entity';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  private readonly logger = new Logger('NotificationRepository');
  constructor(
    @InjectModel('Notification') private readonly interviewModel: Model<NotificationInfo>,
  ) {}

  async create(application: NotificationInfo): Promise<NotificationInfo> {
    this.logger.log(`Creating a new interview application: ${JSON.stringify(application)}`);
    const newApplication = new this.interviewModel(application);
    return await newApplication.save();
  }

  async findById(id: string): Promise<NotificationInfo | null> {
    return await this.interviewModel.findOne({ id }).exec();
  }

  async findAll(): Promise<NotificationInfo[]> {
    return await this.interviewModel.find().exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.interviewModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }
  async getByEmployeeId(employeeId: string): Promise<NotificationInfo[]>{
    const result = await this.interviewModel.find({employeeId})
    return result
  }
}
