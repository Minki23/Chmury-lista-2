import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './Application/app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqps://hnaafuut:f7fxwO4mI6uwZIFWxdQWhelNZ6htKy_8@cow.rmq2.cloudamqp.com/hnaafuut'],
        queue: 'notify_application',
        queueOptions: {
          durable: true,
        },
      },
    }
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(); 
  console.log('NotificationService is listening to RabbitMQ');
}
bootstrap();
