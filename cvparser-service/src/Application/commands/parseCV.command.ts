export class ParseCVCommand {
    constructor(
      public readonly resume: {
        applicationId: string;
        filename: string;
        text: string;
      },
    ) {}
  }