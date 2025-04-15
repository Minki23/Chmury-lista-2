  
  export class Application {
    id: string;
    position: string;
    resume: { text: string; filename: string };
    createdAt: Date;
    updatedAt: Date;
    
    constructor(partial: Partial<Application>) {
      Object.assign(this, partial);
      this.createdAt = this.createdAt || new Date();
      this.updatedAt = this.updatedAt || new Date();
    }
  }