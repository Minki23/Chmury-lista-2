import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { NotifyCommand } from './commands/notify.command';
import { INotificationRepository } from 'src/Domain/repositories/notification-repository.interface';
import { MailerSend, EmailParams, Recipient, Sender } from 'mailersend';

//mlsn.e2556b79c406886ef6e0ffe2a72e686b52c90a58a79ac847fbab4341ec298334
@CommandHandler(NotifyCommand)
export class NotifyHandler implements ICommandHandler<NotifyCommand> {
    private readonly logger = new Logger('NotifyHandler');

    constructor(
        @Inject('INotificationRepository')
        private readonly interviewRepository: INotificationRepository,
    ) {}

    async execute(command: NotifyCommand): Promise<void> {
      const passed = command.passed;
      const position = command.position;
      const date = command.date;
      const details = command.details;
      if (passed) {
        const mailersend = new MailerSend({
          apiKey: 'mlsn.e2556b79c406886ef6e0ffe2a72e686b52c90a58a79ac847fbab4341ec298334',
        });
        const sentFrom = new Sender('MS_03VyVh@test-xkjn41mm6o54z781.mlsender.net', 'Zespół Rekrutacji TechCorp');
        const recipients = [new Recipient(details.email, details.name)];
  
        const emailParams = new EmailParams()
          .setFrom(sentFrom)
          .setReplyTo(sentFrom)
          .setTo(recipients)
          .setSubject(`Gratulacje! Kolejny etap rekrutacji na stanowisko ${position}`)
          .setHtml(`
            <h2>Witaj ${details.name},</h2>
            <p>
              Z przyjemnością informujemy, że pomyślnie przeszedłeś pierwszy etap rekrutacji na stanowisko <strong>${position}</strong>.
            </p>
            <p>
              Kolejnym krokiem będzie rozmowa kwalifikacyjna, która odbędzie się <strong>${date ? new Date(date).toString(): "w swoim czasie"}</strong>.
            </p>
            <p>
              Twój dotychczasowy wynik: <strong>${details.score}%</strong>
            </p>
            <p>W razie pytań skontaktuj się z nami pod adresem: <a href="mailto:rekrutacja@email.com">rekrutacja@email.com</a></p>
            <p>Pozdrawiamy,<br>Zespół Rekrutacyjny TechCorp</p>
          `)
          .setText(`Witaj ${details.name}, zostałeś zaproszony do kolejnego etapu rekrutacji na stanowisko ${position}. Rozmowa odbędzie się ${date ? new Date(date).toString(): "w swoim czasie"}. Twój wynik: ${details.score}%.`);
  
        await mailersend.email.send(emailParams);
      }
      else {
        const mailersend = new MailerSend({
          apiKey: 'mlsn.e2556b79c406886ef6e0ffe2a72e686b52c90a58a79ac847fbab4341ec298334',
        });
        
        const sentFrom = new Sender('MS_03VyVh@test-xkjn41mm6o54z781.mlsender.net', 'Zespół Rekrutacji TechCorp');
        const recipients = [new Recipient(details.email, details.name)];
        
        const emailParams = new EmailParams()
          .setFrom(sentFrom)
          .setReplyTo(sentFrom)
          .setTo(recipients)
          .setSubject(`Dziękujemy za udział w rekrutacji – ${position}`)
          .setHtml(`
            <h2>Witaj ${details.name},</h2>
            <p>
              Dziękujemy za udział w procesie rekrutacyjnym na stanowisko <strong>${position}</strong>.
            </p>
            <p>
              Po dokładnej analizie Twojej aplikacji oraz rozmowy, podjęliśmy decyzję o zakończeniu procesu na obecnym etapie.
            </p>
            <p>
              Twój wynik: <strong>${details.score}%</strong>.
            </p>
            <p>
              Zachęcamy do aplikowania w przyszłości – z przyjemnością rozpatrzymy Twoją kandydaturę ponownie.
            </p>
            <p>W razie pytań jesteśmy dostępni pod adresem: <a href="mailto:rekrutacja@email.com">rekrutacja@email.com</a></p>
            <p>Pozdrawiamy,<br>Zespół Rekrutacyjny TechCorp</p>
          `)
          .setText(`Witaj ${details.name}, dziękujemy za udział w rekrutacji na stanowisko ${position}. Niestety, nie możemy kontynuować procesu. Twój wynik: ${details.score}%.`);
        
        await mailersend.email.send(emailParams);
        
      }

      await this.interviewRepository.create({
        passed: command.passed,
        applicationId: command.applicationId,
        position: command.position,
        employeePhone: command.employeePhone,
        date: command.date,
        details: {
          phoneNumber: command.details.phoneNumber,
          email: command.details.email,
          name: command.details.name,
          links: command.details.links,
          score: command.details.score,
        },
      });
    }
}
