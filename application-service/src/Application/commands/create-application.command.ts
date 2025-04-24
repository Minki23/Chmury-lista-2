export class CreateApplicationCommand {
    constructor(
      public readonly position: string,
      public readonly resume: {
        filename: string;
        text: string;
      },
    ) {}
  }