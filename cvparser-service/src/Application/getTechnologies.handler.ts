import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { GetTechnologiesCommand } from './commands/getTechnologies.command';
import { ITechnologiesRepository } from 'src/Domain/repositories/technologies-repository.interface';
import { TechnologiesInfo } from '../Domain/entities/technologiesInfo.entity';

@CommandHandler(GetTechnologiesHandler)
export class GetTechnologiesHandler implements ICommandHandler<GetTechnologiesCommand> {
  constructor(
    @Inject('ITechnologiesRepository')
    private readonly technologiesRepository: ITechnologiesRepository,
  ) {}

  async execute(): Promise<TechnologiesInfo> {
    const technologiesDeleted = await this.technologiesRepository.get();
    return technologiesDeleted;
  }
}