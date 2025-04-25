export class ScheduleInterviewCommand {
    constructor(
        public readonly applicationId: string,
        public readonly passed: boolean,
        public readonly position: string,
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