import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotifyHandler } from './notify.handler';
import { NotificationController } from 'src/API/controllers/notification.controller';
import { NotificationSchema } from 'src/Infrastructure/database/schemas/notification.schema';
import { NotificationRepository } from 'src/Infrastructure/database/repositories/notification.repository';


const CommandHandlers = [NotifyHandler];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forRoot('mongodb+srv://michal:DcVz77j8KTDTYpSX@recruitment-application.bbb6uka.mongodb.net/notification-service?retryWrites=true&w=majority&appName=recruitment-application'),
    MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]),
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
  controllers: [NotificationController],
  providers: [
    ...CommandHandlers,
    {
      provide: 'INotificationRepository',
      useClass: NotificationRepository,
    },
  ],
})
export class AppModule {}