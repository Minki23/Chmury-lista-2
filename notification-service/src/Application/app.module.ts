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
    MongooseModule.forRoot(process.env.MONGO_DB ?? ''),
    MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]),
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