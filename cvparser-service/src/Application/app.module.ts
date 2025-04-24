import { Get, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApplicationController } from '../API/controllers/application.controller';
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
    MongooseModule.forRoot('mongodb+srv://michal:DcVz77j8KTDTYpSX@recruitment-application.bbb6uka.mongodb.net/?retryWrites=true&w=majority&appName=recruitment-application'),
    MongooseModule.forFeature([{ name: 'ParsedApplications', schema: ApplicationSchema }]),
    MongooseModule.forFeature([{ name: 'StoredTechnologies', schema: TechnologiesSchema }]),
    ClientsModule.register([
      {
        name: 'ReceiveCvBroker',
        transport: Transport.RMQ,
        options: {
          urls: ['amqps://hnaafuut:f7fxwO4mI6uwZIFWxdQWhelNZ6htKy_8@cow.rmq2.cloudamqp.com/hnaafuut'],
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
          urls: ['amqps://hnaafuut:f7fxwO4mI6uwZIFWxdQWhelNZ6htKy_8@cow.rmq2.cloudamqp.com/hnaafuut'],
          queue: 'score_application',
          queueOptions: {
            durable: true
          },
        },
      },
    ]), 
  ],
  controllers: [ApplicationController],
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