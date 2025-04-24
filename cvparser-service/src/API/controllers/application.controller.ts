import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventPattern, Payload, Ctx, RmqContext, ClientProxy } from '@nestjs/microservices';
import { ParseCVCommand } from '../../Application/commands/parseCV.command';
import { AddTechnologiesCommand } from '../../Application/commands/addTechnologies.command';
import { AddTechnologiesDto } from '../dtos/add-technologies.dto';
@Controller()

export class ApplicationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}
  private readonly logger = new Logger("CVParserService");

  @Post('addTechnologies')
  async addTechnologies(@Body() AddTechnologiesDto: AddTechnologiesDto) {
    this.logger.log(`Adding technologies to the database: ${JSON.stringify(AddTechnologiesDto.technologies)}`);
    await this.commandBus.execute(new AddTechnologiesCommand(AddTechnologiesDto.technologies));
  }

  @EventPattern('application-submitted')
  async handleApplicationReceived(@Payload() data: any) {
    this.logger.log('Received application-submitted event:', data.applicationId);
    const applicationId = data.applicationId;
    const position = data.position;
    const resume = data.resume;
    const text = resume.text;
    const filename = resume.filename;

    await this.commandBus.execute(new ParseCVCommand(
      applicationId,
      position,
      {
      applicationId: applicationId,
      filename: filename,
      text: text
    }));
  }
}
