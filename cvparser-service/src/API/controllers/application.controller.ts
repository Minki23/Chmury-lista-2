import { Controller, Inject, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventPattern, Payload, Ctx, RmqContext, ClientProxy } from '@nestjs/microservices';
import { ParseCVCommand } from '../../Application/commands/parseCV.command';
@Controller()

export class ApplicationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}
  private readonly logger = new Logger("CVParserService");

  @EventPattern('application-submitted')
  async handleApplicationReceived(@Payload() data: any) {
    this.logger.log('Received application-submitted event:', data.applicationId);
    const applicationId = data.applicationId;
    const resume = data.resume;
    const text = resume.text;
    const filename = resume.filename;

    await this.commandBus.execute(new ParseCVCommand({
      applicationId: applicationId,
      filename: filename,
      text: text
    }));
  }
}
