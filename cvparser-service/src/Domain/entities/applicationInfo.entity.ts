  
  export class ApplicationInfo {
    id: string;
    position: string;
    resume: { 
      name: string;
      email: string;
      links: string[];
      phone: string;
      text: string;
      filename: string,
      technologies: string[];
    };
    createdAt: Date;
    updatedAt: Date;
    
    constructor(partial: Partial<ApplicationInfo>) {
      Object.assign(this, partial);
      this.createdAt = this.createdAt || new Date();
      this.updatedAt = this.updatedAt || new Date();
    }
  }