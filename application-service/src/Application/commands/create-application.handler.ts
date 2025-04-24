import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateApplicationCommand } from './create-application.command';
import { Application } from '../../Domain/entities/application.entity';
import { IApplicationRepository } from '../../Domain/repositories/application-repository.interface';
import { EventsPublisherService } from '../../Infrastructure/messaging/rabbitmq/events-publisher.service';
import { ApplicationSubmittedEvent } from '../../Domain/Events/application-submitted.event';

@CommandHandler(CreateApplicationCommand)
export class CreateApplicationHandler implements ICommandHandler<CreateApplicationCommand> {
  private readonly logger = new Logger('CreateApplicationHandler')
  constructor(
    @Inject('IApplicationRepository')
    private readonly applicationRepository: IApplicationRepository,
    private readonly eventsPublisher: EventsPublisherService
  ) {}

  async execute(command: CreateApplicationCommand): Promise<Application> {
    const application = new Application({
      id: uuidv4(),
      position: command.position,
      resume: command.resume,
    });

    const savedApplication = await this.applicationRepository.create(application);
    this.logger.log(`Application created with ID: ${savedApplication.id}`);
    await this.eventsPublisher.publish(
      'application-submitted',
      new ApplicationSubmittedEvent(
        savedApplication.id, 
        savedApplication.position,
        savedApplication.resume
      )
    );

    return savedApplication;
  }
}