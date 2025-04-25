import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyCommand } from 'src/Application/commands/notify.command';

@Controller()
export class NotificationController {
  constructor(
    private readonly commandBus: CommandBus
  ) {}
  private readonly logger = new Logger("NotificationService");

  @EventPattern('interview-scheduled')
  async handleInterviewScheduled(@Payload() data: any) {
    this.logger.log('Received interview-scheduled event:', data);
    const applicationId = data.applicationId;
    const passed = data.passed;
    const position = data.position;
    const details = data.details;
    const phoneNumber = details.phoneNumber;
    const email = details.email;
    const name = details.name;
    const links = details.links;
    const score = details.score;
    await this.commandBus.execute(new NotifyCommand(
      applicationId,
      passed,
      position,
      data.dateTime,
      data.employeePhone,
      {
        phoneNumber,
        email,
        name,
        links,
        score
      },
    ));
  }
}
