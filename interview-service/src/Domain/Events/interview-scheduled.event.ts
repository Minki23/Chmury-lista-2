export class InterviewScheduledEvent {
  constructor(
    public readonly applicationId: string,
    public readonly position: string,
    public readonly dateTime: Date,
    public readonly details: {
        filename: string;
        text: string;
        phoneNumber: string;
        email: string;
        name: string;
        links: string[];
        score: number;
    }
  ) {}
}