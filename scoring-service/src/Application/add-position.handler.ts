import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ScoreCVCommand } from './commands/scoreCV.command';
import { ApplicationInfo } from '../Domain/entities/application-info.entity';
import { IScoringRepository } from '../Domain/repositories/scoring-repository.interface';
import { EventsPublisherService } from '../Infrastructure/messaging/rabbitmq/events-publisher.service';
import { ApplicationScoredEvent } from '../Domain/Events/application-scored.event';
import { IPositionsRepository } from '../Domain/repositories/position-repository.interface';
import { AddPositionCommand } from './commands/add-position.command';
import { PositionInfo } from 'src/Domain/entities/positions-info.entity';


@CommandHandler(AddPositionCommand)
export class AddPositionHandler implements ICommandHandler<AddPositionCommand> {
  private readonly logger = new Logger('ScoreCvHandler')
  constructor(
    @Inject('IPositionsRepository')
    private readonly positionsRepository: IPositionsRepository,
  ) {}

  async execute(command: AddPositionCommand): Promise<PositionInfo> {
    this.logger.log(`Adding position: ${JSON.stringify(command)}`);
    const position = new PositionInfo({
        name: command.name,
        keyTechnologies: command.keyTechnologies,
        usefulTechnologies: command.usefulTechnologies,
    });
    const savedPosition = await this.positionsRepository.add(position);
    return savedPosition;
  }
}