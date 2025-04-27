import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventPattern, Payload, Ctx, RmqContext, ClientProxy } from '@nestjs/microservices';
import { ScoreCVCommand } from '../../Application/commands/scoreCV.command';
import { AddPositionCommand } from 'src/Application/commands/add-position.command';
import { GetPositionsQuery } from 'src/Application/queries/get-positions.query';
@Controller()

export class ScoringController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}
  private readonly logger = new Logger("CVScoreService");

  @Post('positions')
  async addPosition(@Body() body: any) {
    this.logger.log('Received position:', body.position);
    const name = body.position.name;
    const keyTechnologies = body.position.keyTechnologies;
    const usefulTechnologies = body.position.usefulTechnologies;

    const position = {
      name: name,
      keyTechnologies: keyTechnologies,
      usefulTechnologies: usefulTechnologies
    };
    await this.commandBus.execute(new AddPositionCommand(
      position.name,
      position.keyTechnologies,
      position.usefulTechnologies
    ));
    this.logger.log('Position added:', position); 
  }
  @Get('positions')
  async getPositions() {
    this.logger.log('Received get positions request');
    const positions = await this.queryBus.execute(new GetPositionsQuery());
    return positions;
  }

  @EventPattern('application-parsed')
  async handleApplicationParsed(@Payload() data: any) {
    this.logger.log('Received application-parsed event:', data.applicationId);
    const applicationId = data.applicationId;
    const position = data.position;
    const resume = data.resume;
    const text = resume.text;
    const filename = resume.filename;
    const email = resume.email;
    const name = resume.name;
    const phone = resume.phoneNumber;
    const links = resume.links;
    const technologies = resume.technologies;
    await this.commandBus.execute(new ScoreCVCommand(
      applicationId,
      position,
      {
      applicationId: applicationId,
      filename: filename,
      text: text,
      phoneNumber: phone,
      email: email,
      name: name,
      links: links,
      technologies: technologies,
    }));
  }
}
