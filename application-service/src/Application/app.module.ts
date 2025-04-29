import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApplicationController } from '../API/controllers/application.controller';
import { ApplicationSchema } from '../Infrastructure/database/schemas/application.schema';
import { ApplicationRepository } from '../Infrastructure/database/repositories/application.repository';
import { EventsPublisherService } from '../Infrastructure/messaging/rabbitmq/events-publisher.service';
import { CreateApplicationHandler } from './commands/create-application.handler';
import { GetApplicationHandler } from './get-application.handler';
import { GetApplicationsHandler } from './get-applications.handler';

const CommandHandlers = [CreateApplicationHandler];
const QueryHandlers = [GetApplicationHandler, GetApplicationsHandler];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forRoot(process.env.MONGO_DB ?? ''),
    MongooseModule.forFeature([{ name: 'Application', schema: ApplicationSchema }]),
    ClientsModule.register([
      {
        name: 'CVReceiveClient',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.BROKER ?? ''],
          queue: 'parse_application',
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