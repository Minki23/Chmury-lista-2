import { Get, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ParserController } from '../API/controllers/parser.controller';
import { ApplicationSchema } from '../Infrastructure/database/schemas/application.schema';
import { ApplicationRepository } from '../Infrastructure/database/repositories/application.repository';
import { EventsPublisherService } from '../Infrastructure/messaging/rabbitmq/events-publisher.service';
import { ParseCvHandler } from './parseCv.handler';
import { TechnologiesSchema } from 'src/Infrastructure/database/schemas/technologies.schema';
import { AddTechnologiesHandler } from './addTechnologies.handler';
import { DeleteTechnologiesHandler } from './deleteTechnologies.handler';
import { GetTechnologiesHandler } from './getTechnologies.handler';
import { TechnologiesRepository } from 'src/Infrastructure/database/repositories/technologies.repository';

const CommandHandlers = [ParseCvHandler, AddTechnologiesHandler, DeleteTechnologiesHandler, AddTechnologiesHandler, GetTechnologiesHandler];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forRoot(process.env.MONGO_DB ?? ''),
    MongooseModule.forFeature([{ name: 'ParsedApplications', schema: ApplicationSchema }]),
    MongooseModule.forFeature([{ name: 'StoredTechnologies', schema: TechnologiesSchema }]),
    ClientsModule.register([
      {
        name: 'ReceiveCvBroker',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.BROKER ?? ''],
          queue: 'parse_application',
          queueOptions: {
            durable: true
          },
        },
      },
      {
        name: 'ScoreCvBroker',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.BROKER ?? ''],
          queue: 'score_application',
          queueOptions: {
            durable: true
          },
        },
      },
    ]), 
  ],
  controllers: [ParserController],
  providers: [
    ...CommandHandlers,
    {
      provide: 'ITechnologiesRepository',
      useClass: TechnologiesRepository,
    },
    {
      provide: 'IApplicationRepository',
      useClass: ApplicationRepository,
    },
    EventsPublisherService,
  ],
})
export class AppModule {}