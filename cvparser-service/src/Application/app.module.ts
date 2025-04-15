import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApplicationController } from '../API/controllers/application.controller';
import { ApplicationSchema } from '../Infrastructure/database/schemas/application.schema';
import { ApplicationRepository } from '../Infrastructure/database/repositories/application.repository';
import { EventsPublisherService } from '../Infrastructure/messaging/rabbitmq/events-publisher.service';
import { ParseCvHandler } from './parseCv.handler';
import { GetApplicationHandler } from './get-application.handler';
import { GetApplicationsHandler } from './get-applications.handler';

const CommandHandlers = [ParseCvHandler];
const QueryHandlers = [GetApplicationHandler, GetApplicationsHandler];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forRoot('mongodb+srv://michal:rOozHrJxPAOjq8wi@recruitment-application.fdlisyk.mongodb.net/?retryWrites=true&w=majority&appName=recruitment-application'),
    MongooseModule.forFeature([{ name: 'ParsedApplications', schema: ApplicationSchema }]),
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
    ...QueryHandlers,
    {
      provide: 'IApplicationRepository',
      useClass: ApplicationRepository,
    },
    EventsPublisherService,
  ],
})
export class AppModule {}