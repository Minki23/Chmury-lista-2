import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ScheduleInterviewCommand } from './commands/schedule-interview.command';
import { EventsPublisherService } from '../Infrastructure/messaging/rabbitmq/events-publisher.service';
import { InterviewScheduledEvent } from '../Domain/Events/interview-scheduled.event';
import { IInterviewsRepository } from 'src/Domain/repositories/interview-repository.interface';
import { IEmployeeRepository } from 'src/Domain/repositories/employee-repository.interface';

@CommandHandler(ScheduleInterviewCommand)
export class ScheduleInterviewHandler implements ICommandHandler<ScheduleInterviewCommand> {
    private readonly logger = new Logger('ScheduleInterviewHandler');

    constructor(
        @Inject('IInterviewRepository')
        private readonly interviewRepository: IInterviewsRepository,
        @Inject('IEmployeeRepository')
        private readonly employeeRepository: IEmployeeRepository,
        private readonly eventsPublisher: EventsPublisherService,
    ) {}

    private async findAvailableEmployee(position: string, startDate: Date): Promise<{ id: string, scheduledDate: Date } | null> {
        const CHECK_INTERVAL_MINUTES = 60;
      
        let date = new Date(startDate);
      
        while (true) {
          const day = date.getDay();
          if (day === 0 || day === 6) {
            date.setDate(date.getDate() + 1);
            date.setHours(9, 0, 0, 0);
            continue;
          }
      
          const hour = date.getHours();
          if (hour < 9) {
            date.setHours(9, 0, 0, 0);
          } else if (hour >= 15) {
            date.setDate(date.getDate() + 1);
            date.setHours(9, 0, 0, 0);
            continue;
          }
      
          const employees = await this.employeeRepository.getWithPosition(position);
      
          for (const employee of employees) {
            const interviews = await this.interviewRepository.getByEmployeeId(employee.id);
      
            const hasConflict = interviews.some(interview => {
              const interviewDate = new Date(interview.date);
              return Math.abs(interviewDate.getTime() - date.getTime()) < CHECK_INTERVAL_MINUTES * 60 * 1000;
            });
      
            if (!hasConflict) {
              return { id: employee.id, scheduledDate: new Date(date) };
            }
          }
      
          date = new Date(date.getTime() + CHECK_INTERVAL_MINUTES * 60 * 1000);
        }
      }
      
    

    async execute(command: ScheduleInterviewCommand): Promise<void> {
        const applicationId = command.applicationId
        const position = command.position
        const firstDate = new Date();
        firstDate.setDate(firstDate.getDate() + ((1 + 7 - firstDate.getDay()) % 7));
        firstDate.setHours(11, 0, 0, 0); 
        const result = await this.findAvailableEmployee(command.position, firstDate);
        if (!result) {
            throw new Error('No available employee found for the given position and date.');
        }
        const { id: employeeId, scheduledDate: date }: { id: string; scheduledDate: Date } = result;
        const details = command.details;
        
        await this.eventsPublisher.publish(
            'interview-scheduled',
            new InterviewScheduledEvent(applicationId, position, date, details)
        );
        await this.interviewRepository.create({
            applicationId,
            position,
            employeeId,
            date,
            details,
        });
        this.logger.log(`Interview scheduled successfully for applicationId: ${applicationId}`);
    }
}
