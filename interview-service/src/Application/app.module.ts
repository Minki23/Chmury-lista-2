import { Get, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventsPublisherService } from '../Infrastructure/messaging/rabbitmq/events-publisher.service';
import { AddEmployeeHandler } from './add-employee.handler';
import { ScheduleInterviewHandler } from './schedule-interview.handler';
import { InterviewController } from 'src/API/controllers/intreview.controller';
import { EmployeeSchema } from 'src/Infrastructure/database/schemas/employee.schema';
import { InterviewSchema } from 'src/Infrastructure/database/schemas/interview.schema';
import { InterviewRepository } from 'src/Infrastructure/database/repositories/interview.repository';
import { EmployeeRepository } from 'src/Infrastructure/database/repositories/employee.repository';


const CommandHandlers = [AddEmployeeHandler, ScheduleInterviewHandler];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forRoot(process.env.MONGO_DB ?? ''),
    MongooseModule.forFeature([{ name: 'Employee', schema: EmployeeSchema }]),
    MongooseModule.forFeature([{ name: 'Interview', schema: InterviewSchema }]),
    ClientsModule.register([
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
      {
        name: 'NotificationCvBroker',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.BROKER ?? ''],
          queue: 'notify_application',
          queueOptions: {
            durable: true
          },
        },
      },
    ]), 
  ],
  controllers: [InterviewController],
  providers: [
    ...CommandHandlers,
    {
      provide: 'IInterviewRepository',
      useClass: InterviewRepository,
    },
    {
      provide: 'IEmployeeRepository',
      useClass: EmployeeRepository,
    },
    EventsPublisherService,
  ],
})
export class AppModule {}