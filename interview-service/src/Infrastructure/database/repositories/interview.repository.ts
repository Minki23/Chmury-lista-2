import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IInterviewsRepository } from 'src/Domain/repositories/interview-repository.interface';
import { InterviewInfo } from 'src/Domain/entities/intreview-info.entity';
import { EmployeeInfo } from 'src/Domain/entities/employee-info.enity';

@Injectable()
export class InterviewRepository implements IInterviewsRepository {
  private readonly logger = new Logger('InterviewRepository');
  constructor(
    @InjectModel('Interview') private readonly interviewModel: Model<InterviewInfo>,
    @InjectModel('Employee') private readonly employeesModel: Model<EmployeeInfo>
  ) {}

  async create(application: InterviewInfo): Promise<InterviewInfo> {
    this.logger.log(`Creating a new interview application: ${JSON.stringify(application)}`);
    const newApplication = new this.interviewModel(application);
    return await newApplication.save();
  }

  async findById(id: string): Promise<InterviewInfo | null> {
    return await this.interviewModel.findOne({ id }).exec();
  }

  async findAll(): Promise<InterviewInfo[]> {
    return await this.interviewModel.find().exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.interviewModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }
  async getByEmployeeId(employeeId: string): Promise<InterviewInfo[]>{
    const result = await this.interviewModel.find({employeeId})
    return result
  }
}
