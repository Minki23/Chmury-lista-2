import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ScoreCVCommand } from './commands/scoreCV.command';
import { ApplicationInfo } from '../Domain/entities/application-info.entity';
import { IScoringRepository } from '../Domain/repositories/scoring-repository.interface';
import { EventsPublisherService } from '../Infrastructure/messaging/rabbitmq/events-publisher.service';
import { ApplicationScoredEvent } from '../Domain/Events/application-scored.event';
import { IPositionsRepository } from '../Domain/repositories/position-repository.interface';
import { PositionInfo } from 'src/Domain/entities/positions-info.entity';


@CommandHandler(ScoreCVCommand)
export class ScoreCvHandler implements ICommandHandler<ScoreCVCommand> {
  private readonly logger = new Logger('ScoreCvHandler')
  constructor(
    @Inject('IScoringRepository')
    private readonly scoringRepository: IScoringRepository,
    @Inject('IPositionsRepository')
    private readonly positionsRepository: IPositionsRepository,
    private readonly eventsPublisher: EventsPublisherService
  ) {}

  async execute(command: ScoreCVCommand): Promise<ApplicationInfo> {
    const position = command.position;
    const resume = command.resume;
    const id = command.applicationId;
    const phone = resume.phoneNumber;
    const email = resume.email;
    const technologies = resume.technologies;
    const links = resume.links;
    const { score, keyTec } = await this.scoreResume(technologies, position, links);
    const passed = score >= 60;
    this.logger.log(command)
    const application = new ApplicationInfo({
      id,
      passed,
      position,
      resume: {
        name: resume.name ?? '',
        email: email ?? '',
        phoneNumber: phone ?? '',
        links: links,
        score: score
      },
      requiredTechnologies: keyTec,
    });
    const savedApplication = await this.scoringRepository.create(application);
    await this.eventsPublisher.publish(
      'application-scored',
      new ApplicationScoredEvent(
      id,
      passed,
      position,
      {
        phoneNumber: phone,
        email: email,
        name: savedApplication.resume.name,
        links: savedApplication.resume.links,
        score: score,
      },
      keyTec
      )
    );

    return savedApplication;
  }

  private calcMaxScore(positionDetails: PositionInfo): number {
    const keyTechnologies = positionDetails.keyTechnologies.map(tech => tech.toLowerCase());
    const usefulTechnologies = positionDetails.usefulTechnologies.map(tech => tech.toLowerCase());

    const keyTechScore = keyTechnologies.length * 15;
    const usefulTechScore = usefulTechnologies.length * 5;

    return keyTechScore + usefulTechScore + 12;
  }

  private async scoreResume(technologies: string[], position: string, links: string[]): Promise<{ score: number; keyTec: string[] }> {
    let score = 0;
    const positionDetails = await this.positionsRepository.findByPosition(position);
    const maxScore = positionDetails ? this.calcMaxScore(positionDetails) : 100;
    let keyTec: string[] = [];
    if (positionDetails) {
      const keyTechnologies = positionDetails.keyTechnologies.map(tech => tech.toLowerCase());
      const usefulTechnologies = positionDetails.usefulTechnologies.map(tech => tech.toLowerCase());

      const keyTechMatches = technologies.filter(tech => keyTechnologies.includes(tech.toLowerCase()));
      score += keyTechMatches.length * 15;

      const usefulTechMatches = technologies.filter(tech => usefulTechnologies.includes(tech.toLowerCase()));
      score += usefulTechMatches.length * 5;

      keyTec = keyTechnologies
    }
  
    if (links.some(link => link.includes('github.com'))) {
      score += 5;
    }
    if (links.some(link => link.includes('linkedin.com'))) {
      score += 5;
    }
    if (links.length >= 3) {
      score += 2;
    }
  
    return { score: parseFloat((score / maxScore * 100).toFixed(2)), keyTec };
  }
  
}