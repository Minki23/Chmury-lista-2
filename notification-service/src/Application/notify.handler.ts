import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { NotifyCommand } from './commands/notify.command';
import { INotificationRepository } from 'src/Domain/repositories/notification-repository.interface';

@CommandHandler(NotifyCommand)
export class NotifyHandler implements ICommandHandler<NotifyCommand> {
    private readonly logger = new Logger('NotifyHandler');

    constructor(
        @Inject('INotificationRepository')
        private readonly interviewRepository: INotificationRepository,
    ) {}

    async execute(command: NotifyCommand): Promise<void> {
      this.logger.log(command)
      await this.interviewRepository.create({
        passed: command.passed,
        applicationId: command.applicationId,
        position: command.position,
        date: command.date,
        details: {
          phoneNumber: command.details.phoneNumber,
          email: command.details.email,
          name: command.details.name,
          links: command.details.links,
          score: command.details.score,
        },
      });
    }
}
