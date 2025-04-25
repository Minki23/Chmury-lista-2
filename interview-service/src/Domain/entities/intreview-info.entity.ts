
export class InterviewInfo {
    applicationId: string;
    passed: boolean;
    position: string;
    employeePhone: string | null;
    date: Date | null;
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