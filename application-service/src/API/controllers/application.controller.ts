import { Body, Logger, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateApplicationDto } from '../dtos/create-application.dto';
import { CreateApplicationCommand } from '../../Application/commands/create-application.command'
import { GetApplicationQuery } from '../../Application/queries/get-application/get-application.query';
import { GetApplicationsQuery } from '../../Application/queries/get-applications/get-applications.query';
import { Application } from '../../Domain/entities/application.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as pdfParse from 'pdf-parse';

@Controller('applications')
export class ApplicationController {
  private readonly logger = new Logger("application_service")
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('resume'))
  async create(
    @UploadedFile() resumeFile: Express.Multer.File,
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    const pdfText = await pdfParse(resumeFile.buffer);
    return this.commandBus.execute(
      new CreateApplicationCommand({
        ...createApplicationDto,
          filename: resumeFile.originalname,
          text: pdfText.text,
      })
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Application> {
    return this.queryBus.execute(new GetApplicationQuery(id));
  }

  @Get()
  async findAll(): Promise<Application[]> {
    return this.queryBus.execute(new GetApplicationsQuery());
  }
}
