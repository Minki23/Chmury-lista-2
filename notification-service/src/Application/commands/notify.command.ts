export class NotifyCommand {
    constructor(
      public readonly applicationId: string,
      public readonly passed: boolean,
      public readonly position: string,
      public readonly date: Date | null,
      public readonly employeePhone: string | null,
      public readonly details: {
        phoneNumber: string;
        email: string;
        name: string;
        links: string[];
        score: number;
      },
    ) {}
  }
  