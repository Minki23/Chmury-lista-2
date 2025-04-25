export class ApplicationScoredEvent {
    constructor(
      public readonly applicationId: string,
      public readonly passed: boolean,
      public readonly position: string,
      public readonly resume: { 
        phoneNumber: string;
        email: string;
        name: string;
        score: number;
        links: string[];
      },
    ) {}
  }