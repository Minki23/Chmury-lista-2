export class InterviewScheduledEvent {
  constructor(
    public readonly applicationId: string,
    public readonly passed: boolean,
    public readonly position: string,
    public readonly employeePhone: string | null,
    public readonly dateTime: Date | null,
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