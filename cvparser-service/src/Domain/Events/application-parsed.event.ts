export class ApplicationParsedEvent {
    constructor(
      public readonly applicationId: string,
      public readonly position: string,
      public readonly resume: { 
        phoneNumber: string;
        email: string;
        name: string;
        links: string[];
        text: string;
        filename: string;
        technologies: string[];
      },
    ) {}
  }