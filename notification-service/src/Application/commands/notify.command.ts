export class NotifyCommand {
    constructor(
      public readonly passed: boolean,
      public readonly applicationId: string,
      public readonly position: string,
      public readonly date: Date,
      public readonly details: {
        phoneNumber: string;
        email: string;
        name: string;
        links: string[];
        score: number;
      },
    ) {}
  }
  