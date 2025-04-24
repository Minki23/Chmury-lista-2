export class ScoreCVCommand {
    constructor(
      public readonly applicationId: string,
      public readonly position: string,
      public readonly resume: {
        applicationId: string;
        filename: string;
        text: string;
        phoneNumber: string;
        email: string;
        name: string;
        links: string[];
        technologies: string[];
      },
    ) {}
  }