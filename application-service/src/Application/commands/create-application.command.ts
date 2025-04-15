export class CreateApplicationCommand {
    constructor(
      public readonly resume: {
        filename: string;
        text: string;
      },
    ) {}
  }