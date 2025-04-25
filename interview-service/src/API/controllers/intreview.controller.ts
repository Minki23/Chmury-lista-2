import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventPattern, Payload, Ctx, RmqContext, ClientProxy } from '@nestjs/microservices';
import { ScheduleInterviewCommand } from '../../Application/commands/schedule-interview.command';
import { AddEmployeeCommand } from 'src/Application/commands/add-employee.command';
@Controller()

export class InterviewController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}
  private readonly logger = new Logger("InterviewService");

  @Post('employee')
  async addEmployee(@Body() body: any) {
    const name = body.employee.name;
    const position = body.employee.position;
    const phone = body.employee.phone;
    const email = body.employee.email;

    const employee = {
      name: name,
      position: position,
      phone: phone,
      email: email
    };

    await this.commandBus.execute(new AddEmployeeCommand(
      name,
      position,
      phone,
      email
    ));
    this.logger.log('Employee added:', employee);
    
  }

  @EventPattern('application-scored')
  async handleApplicationScored(@Payload() data: any) {
    const applicationId = data.applicationId;
    const passed = data.passed;
    const position = data.position;
    const resume = data.resume;
    const phone = resume.phoneNumber;
    const email = resume.email;
    const score = resume.score;

    const filename = resume.filename;
    const text = resume.text;
    const name = resume.name;
    const links = resume.links;
    await this.commandBus.execute(new ScheduleInterviewCommand(
      applicationId,
      passed,
      position,
      {
        filename: filename,
        text: text,
        phoneNumber: phone,
        email: email,
        name: name,
        links: links,
        score: score
      }
    ));
  }
}
