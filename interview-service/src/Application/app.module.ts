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
    MongooseModule.forRoot('mongodb+srv://michal:DcVz77j8KTDTYpSX@recruitment-application.bbb6uka.mongodb.net/interview-service?retryWrites=true&w=majority&appName=recruitment-application'),
    MongooseModule.forFeature([{ name: 'Employee', schema: EmployeeSchema }]),
    MongooseModule.forFeature([{ name: 'Interview', schema: InterviewSchema }]),
    ClientsModule.register([
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
      {
        name: 'NotificationCvBroker',
        transport: Transport.RMQ,
        options: {
          urls: ['amqps://hnaafuut:f7fxwO4mI6uwZIFWxdQWhelNZ6htKy_8@cow.rmq2.cloudamqp.com/hnaafuut'],
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