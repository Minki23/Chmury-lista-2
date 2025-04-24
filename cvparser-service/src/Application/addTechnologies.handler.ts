import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { AddTechnologiesCommand } from './commands/addTechnologies.command';
import { TechnologiesInfo } from '../Domain/entities/technologiesInfo.entity';
import { ITechnologiesRepository } from 'src/Domain/repositories/technologies-repository.interface';

@CommandHandler(AddTechnologiesCommand)
export class AddTechnologiesHandler implements ICommandHandler<AddTechnologiesCommand> {
  private readonly logger = new Logger('ParseCvHandler')
  constructor(
    @Inject('ITechnologiesRepository')
    private readonly technologiesRepository: ITechnologiesRepository,
  ) {}

  async execute(command: AddTechnologiesCommand): Promise<TechnologiesInfo> {
    const technologies = new TechnologiesInfo({
        technologies: command.technologies,
    });
    const savedTechnologies = await this.technologiesRepository.add(technologies);
    return savedTechnologies;
  }
}