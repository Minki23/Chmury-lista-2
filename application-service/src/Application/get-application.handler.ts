import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetApplicationQuery } from './queries/get-application/get-application.query';
import { Application } from '../Domain/entities/application.entity';
import { IApplicationRepository } from '../Domain/repositories/application-repository.interface';

@QueryHandler(GetApplicationQuery)
export class GetApplicationHandler implements IQueryHandler<GetApplicationQuery> {
  constructor(
    @Inject('IApplicationRepository')
    private readonly applicationRepository: IApplicationRepository
  ) {}

  async execute(query: GetApplicationQuery): Promise<Application> {
    const application = await this.applicationRepository.findById(query.id);
    
    if (!application) {
      throw new NotFoundException(`Application with ID ${query.id} not found`);
    }
    
    return application;
  }
}