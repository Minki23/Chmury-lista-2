export class ParseCVCommand {
    constructor(
      public readonly applicationId: string,
      public readonly position: string,
      public readonly resume: {
        applicationId: string;
        filename: string;
        text: string;
      },
    ) {}
  }