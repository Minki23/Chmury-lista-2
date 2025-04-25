export class NotificationInfo {
    passed: boolean;
    applicationId: string;
    position: string;
    date: Date | null;
    employeePhone: string | null;
    details: {
      phoneNumber: string;
      email: string;
      name: string;
      links: string[];
      score: number;
    };
  
    constructor(partial: Partial<NotificationInfo>) {
      Object.assign(this, partial);
    }
  }
  