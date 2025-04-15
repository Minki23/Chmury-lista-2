import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetApplicationsQuery } from './queries/get-applications/get-applications.query';
import { ApplicationInfo } from '../Domain/entities/applicationInfo.entity';
import { IApplicationRepository } from '../Domain/repositories/application-repository.interface';

@QueryHandler(GetApplicationsQuery)
export class GetApplicationsHandler implements IQueryHandler<GetApplicationsQuery> {
  constructor(
    @Inject('IApplicationRepository')
    private readonly applicationRepository: IApplicationRepository
  ) {}

  async execute(query: GetApplicationsQuery): Promise<ApplicationInfo[]> {
    const application = await this.applicationRepository.findAll();
    
    return application;
  }
}