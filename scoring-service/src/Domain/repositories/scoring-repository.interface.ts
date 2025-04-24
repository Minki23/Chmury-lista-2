import { ApplicationInfo } from '../entities/application-info.entity';

export interface IScoringRepository {
  create(application: ApplicationInfo): Promise<ApplicationInfo>;
  findById(id: string): Promise<ApplicationInfo | null>;
  delete(id: string): Promise<boolean>;
}