import { Get, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScoringController } from '../API/controllers/scoring.controller';
import { ApplicationSchema } from '../Infrastructure/database/schemas/application.schema';
import { ScoringRepository } from '../Infrastructure/database/repositories/scoring.repository';
import { EventsPublisherService } from '../Infrastructure/messaging/rabbitmq/events-publisher.service';
import { ScoreCvHandler } from './scoreCv.handler';
import { PositionsSchema } from 'src/Infrastructure/database/schemas/positions.schema';
import { PositionsRepository } from 'src/Infrastructure/database/repositories/positions.repository';
import { AddPositionHandler } from './handlers/add-position.handler';
import { GetPositionsHandler } from './handlers/get-positions.handler';

const CommandHandlers = [ScoreCvHandler, AddPositionHandler];
const QueryHandlers = [GetPositionsHandler];
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forRoot('mongodb+srv://michal:DcVz77j8KTDTYpSX@recruitment-application.bbb6uka.mongodb.net/scoring-service?retryWrites=true&w=majority&appName=recruitment-application'),
    MongooseModule.forFeature([{ name: 'StoredPositions', schema: PositionsSchema }]),
    MongooseModule.forFeature([{ name: 'ScoredApplications', schema: ApplicationSchema }]),
    ClientsModule.register([
      {
        name: 'ReceiveCvBroker',
        transport: Transport.RMQ,
        options: {
          urls: ['amqps://hnaafuut:f7fxwO4mI6uwZIFWxdQWhelNZ6htKy_8@cow.rmq2.cloudamqp.com/hnaafuut'],
          queue: 'score_application',
          queueOptions: {
            durable: true
          },
        },
      },
      {
        name: 'InterviewCvBroker',
        transport: Transport.RMQ,
        options: {
          urls: ['amqps://hnaafuut:f7fxwO4mI6uwZIFWxdQWhelNZ6htKy_8@cow.rmq2.cloudamqp.com/hnaafuut'],
          queue: 'interview_application',
          queueOptions: {
            durable: true
          },
        },
      },
    ]), 
  ],
  controllers: [ScoringController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: 'IScoringRepository',
      useClass: ScoringRepository,
    },
    {
      provide: 'IPositionsRepository',
      useClass: PositionsRepository,
    },
    EventsPublisherService,
  ],
})
export class AppModule {}