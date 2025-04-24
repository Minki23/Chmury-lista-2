import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { DeleteTechnologiesCommand } from './commands/deleteTechnologies.command';
import { ITechnologiesRepository } from 'src/Domain/repositories/technologies-repository.interface';
import { TechnologiesInfo } from '../Domain/entities/technologiesInfo.entity';

@CommandHandler(DeleteTechnologiesHandler)
export class DeleteTechnologiesHandler implements ICommandHandler<DeleteTechnologiesCommand> {
  constructor(
    @Inject('ITechnologiesRepository')
    private readonly technologiesRepository: ITechnologiesRepository,
  ) {}

  async execute(command: DeleteTechnologiesCommand): Promise<Boolean> {
    const technologies = command.technologies
    const technologiesDeleted = await this.technologiesRepository.delete(technologies);
    return technologiesDeleted;
  }
}