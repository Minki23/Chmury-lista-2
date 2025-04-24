import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITechnologiesRepository } from '../../../Domain/repositories/technologies-repository.interface';
import { TechnologiesInfo } from 'src/Domain/entities/technologiesInfo.entity';

@Injectable()
export class TechnologiesRepository implements ITechnologiesRepository {
  private readonly logger = new Logger('TechnologiesRepository');
  constructor(
    @InjectModel('StoredTechnologies') private readonly technologiesModel: Model<TechnologiesInfo>
  ) {}

  async add(technologies: TechnologiesInfo): Promise<TechnologiesInfo> {
    const newTechnology = new this.technologiesModel(technologies);
    return await newTechnology.save();
  }

  async get(): Promise<TechnologiesInfo> {
    const documents = await this.technologiesModel.find().exec() || [];
    const technologies = new TechnologiesInfo({ technologies: documents.map(doc => doc.technologies).flat() });
    this.logger.log(`Technologies retrieved: ${JSON.stringify(technologies)}`);
    return technologies;
  }

  async delete(technologies: string[]): Promise<boolean> {
    const storedTechnologies = await this.technologiesModel.find().exec();
    if (!technologies) {
      this.logger.error(`Technologies not found`);
      return false;
    }
    const techTable = storedTechnologies.map(doc => doc.technologies).flat();
    for (const doc of technologies) {
        const index = techTable.indexOf(doc);
        if (index === -1) {
            this.logger.error(`Technology ${doc} not found`);
            continue
        }
        techTable.splice(index, 1);
    }
    const updatedTechnologies = new TechnologiesInfo({ technologies: techTable});
    const result = await this.technologiesModel.updateMany({}, { $set: { technologies: updatedTechnologies.technologies } }).exec();

    return result.modifiedCount > 0;
  }
}
