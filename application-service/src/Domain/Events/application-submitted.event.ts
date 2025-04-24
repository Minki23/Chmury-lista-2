export class ApplicationSubmittedEvent {
    constructor(
      public readonly applicationId: string,
      public readonly position: string,
      public readonly resume: { 
        text: string;
        filename: string;
      },
    ) {}
  }