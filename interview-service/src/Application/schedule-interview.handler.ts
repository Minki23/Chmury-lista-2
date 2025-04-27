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

    private async findAvailableEmployee(startDate: Date, requiredTechnologies: string[]): Promise<{ phone: string, scheduledDate: Date }> {
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
          this.logger.log(`requiredTechnologies: ${requiredTechnologies}`)
          const employees = await this.employeeRepository.getWithTechnologies(requiredTechnologies);
      
          for (const employee of employees) {
            const interviews = await this.interviewRepository.getByEmployeeId(employee.id);
      
            const hasConflict = interviews.some(interview => {
              const interviewDate = interview.date ? new Date(interview.date) : null;
              return interviewDate !== null && Math.abs(interviewDate.getTime() - date.getTime()) < CHECK_INTERVAL_MINUTES * 60 * 1000;
            });
      
            if (!hasConflict) {
              return { phone: employee.phone, scheduledDate: new Date(date) };
            }
          }
      
          date = new Date(date.getTime() + CHECK_INTERVAL_MINUTES * 60 * 1000);
        }
      }
      
    

    async execute(command: ScheduleInterviewCommand): Promise<void> {
        const applicationId = command.applicationId
        const passed = command.passed
        const position = command.position
        const details = command.details;
        const requiredTchnologies = command.requiredTechnologies;
        if (!passed) {
          await this.eventsPublisher.publish(
            'interview-scheduled',
            new InterviewScheduledEvent(applicationId, passed, position, null, null, details)
          );
          await this.interviewRepository.create({
              applicationId,
              passed,
              position,
              employeePhone: null,
              date: null,
              details
          });

        }
        const firstDate = new Date();
        firstDate.setDate(firstDate.getDate() + ((1 + 7 - firstDate.getDay()) % 7));
        firstDate.setHours(11, 0, 0, 0); 
        
        const result = await this.findAvailableEmployee(firstDate, requiredTchnologies);

        const { phone: employeePhone, scheduledDate: date }: { phone: string; scheduledDate: Date } = result;
        await this.eventsPublisher.publish(
            'interview-scheduled',
            new InterviewScheduledEvent(applicationId, passed, position, employeePhone, date, details)
        );
        await this.interviewRepository.create({
            applicationId,
            passed,
            position,
            employeePhone,
            date,
            details
        });
        this.logger.log(`Interview scheduled successfully for applicationId: ${applicationId}`);
    }
}
