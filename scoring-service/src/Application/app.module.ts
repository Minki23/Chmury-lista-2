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
    MongooseModule.forRoot(process.env.MONGO_DB ?? ''),
    MongooseModule.forFeature([{ name: 'StoredPositions', schema: PositionsSchema }]),
    MongooseModule.forFeature([{ name: 'ScoredApplications', schema: ApplicationSchema }]),
    ClientsModule.register([
      {
        name: 'ReceiveCvBroker',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.BROKER ?? ''],
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
          urls: [process.env.BROKER ?? ''],
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