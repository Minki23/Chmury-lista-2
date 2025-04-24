
export class InterviewInfo {
    applicationId: string;
    position: string;
    employeeId: string;
    date: Date;
    details: {
        filename: string;
        text: string;
        phoneNumber: string;
        email: string;
        name: string;
        links: string[];
        score: number;
    }
    constructor(partial: Partial<InterviewInfo>) {
        Object.assign(this, partial);
    }
}