import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ParseCVCommand } from './commands/parseCV.command';
import { ApplicationInfo } from '../Domain/entities/applicationInfo.entity';
import { IApplicationRepository } from '../Domain/repositories/application-repository.interface';
import { EventsPublisherService } from '../Infrastructure/messaging/rabbitmq/events-publisher.service';
import { ApplicationParsedEvent } from '../Domain/Events/application-parsed.event';
import { ITechnologiesRepository } from '../Domain/repositories/technologies-repository.interface';
import { IsEmail } from 'class-validator';
import e from 'express';
import { link } from 'fs';

@CommandHandler(ParseCVCommand)
export class ParseCvHandler implements ICommandHandler<ParseCVCommand> {
  private readonly logger = new Logger('ParseCvHandler')
  constructor(
    @Inject('IApplicationRepository')
    private readonly applicationRepository: IApplicationRepository,
    @Inject('ITechnologiesRepository')
    private readonly technologiesRepository: ITechnologiesRepository,
    private readonly eventsPublisher: EventsPublisherService
  ) {}

  async execute(command: ParseCVCommand): Promise<ApplicationInfo> {
    const position = command.position;
    const resume = command.resume;
    const text = resume.text
    const filename = resume.filename;
    const email = this.extractEmail(text);
    const name = this.extractName(text);
    const phone = this.extractPhone(text);
    const links = this.extractLinks(text);
    const technologies = await this.extractTechnologies(text);
    const application = new ApplicationInfo({
      position,
      resume: {
        email: email ?? '',
        name: name ?? '',
        phone: phone ?? '',
        links: links,
        filename,
        text,
        technologies: technologies
      },
    });
    const savedApplication = await this.applicationRepository.create(application);

    await this.eventsPublisher.publish(
      'application-parsed',
      new ApplicationParsedEvent(
      savedApplication.id,
      position,
      {
        phoneNumber: application.resume.phone,
        email: application.resume.email,
        name: savedApplication.resume.name,
        links: savedApplication.resume.links,
        text: savedApplication.resume.text,
        filename: savedApplication.resume.filename,
        technologies: savedApplication.resume.technologies,
      }
      )
    );

    return savedApplication;
  }

  private extractEmail(text: string): string | null {
    const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
    return match ? match[0] : null;
  }

  private escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }  

  private async extractTechnologies(text: string): Promise<string[]> {
    const possibleTechnologies = (await this.technologiesRepository.get()).technologies;
    const foundTechnologies: string[] = [];
    for (const technology of Array.isArray(possibleTechnologies) ? possibleTechnologies : []) {
      const escaped = this.escapeRegExp(technology);
      const regex = new RegExp(`(^|[^a-zA-Z0-9#\\+])${escaped}([^a-zA-Z0-9#\\+]|$)`, 'i');
      if (regex.test(text)) {
        foundTechnologies.push(technology);
      }
    }
    
    this.logger.log(`Found technologies: ${foundTechnologies}`);
    return foundTechnologies;
  }

  private extractName(text: string): string | null {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    return lines[0];
  }
  private extractPhone(text: string): string | null {
    const match = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/);
    return match ? match[0] : null;
  }

  private extractLinks(text: string): string[] {
    const regex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const matches = text.match(regex);
    return matches ? matches : [];
  }
}