  
  export class ApplicationInfo {
    id: string;
    passed: boolean;
    position: string;
    resume: { 
      phoneNumber: string;
      email: string;
      name: string;
      score: number;
      links: string[];
    };
    createdAt: Date;
    updatedAt: Date;
    
    constructor(partial: Partial<ApplicationInfo>) {
      Object.assign(this, partial);
      this.createdAt = this.createdAt || new Date();
      this.updatedAt = this.updatedAt || new Date();
    }
  }