
export class PositionInfo {
   name: string;
   keyTechnologies: string[];
   usefulTechnologies: string[];
    
    constructor(partial: Partial<PositionInfo>) {
        Object.assign(this, partial);
    }
  }