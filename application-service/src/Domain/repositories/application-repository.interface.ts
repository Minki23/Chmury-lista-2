import { Application } from '../entities/application.entity';

export interface IApplicationRepository {
  create(application: Application): Promise<Application>;
  findById(id: string): Promise<Application | null>;
  findAll(): Promise<Application[]>;
  update(id: string, application: Partial<Application>): Promise<Application>;
  delete(id: string): Promise<boolean>;
}