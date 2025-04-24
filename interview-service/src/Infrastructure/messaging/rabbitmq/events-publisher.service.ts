import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class EventsPublisherService {
  constructor(
    @Inject('NotificationCvBroker')
    private readonly client: ClientProxy
  ) {}

  async publish(pattern: string, data: any): Promise<void> {
    try {
      this.client.emit(pattern, data);
    } catch (error) {
      console.error(`Error publishing message: ${error.message}`);
      throw error;
    }
  }
}