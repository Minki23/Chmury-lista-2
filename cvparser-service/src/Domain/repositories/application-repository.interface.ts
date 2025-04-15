import { ApplicationInfo } from '../entities/applicationInfo.entity';

export interface IApplicationRepository {
  create(application: ApplicationInfo): Promise<ApplicationInfo>;
  findById(id: string): Promise<ApplicationInfo | null>;
  findAll(): Promise<ApplicationInfo[]>;
  update(id: string, application: Partial<ApplicationInfo>): Promise<ApplicationInfo>;
  delete(id: string): Promise<boolean>;
}