
export class TechnologiesInfo {
   technologies: string[] = [];
    
    constructor(partial: Partial<TechnologiesInfo>) {
        Object.assign(this, partial);
    }
  }