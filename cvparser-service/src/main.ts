import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './Application/app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqps://hnaafuut:f7fxwO4mI6uwZIFWxdQWhelNZ6htKy_8@cow.rmq2.cloudamqp.com/hnaafuut'],
      queue: 'parse_application',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3002); 
  console.log('CvParser is running on port 3003 and listening to RabbitMQ');
}
bootstrap();
