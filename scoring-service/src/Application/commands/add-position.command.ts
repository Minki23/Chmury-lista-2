import { PositionInfo } from "src/Domain/entities/positions-info.entity";

export class AddPositionCommand {
     constructor(
        public readonly name: string,
        public readonly keyTechnologies: string[],
        public readonly usefulTechnologies: string[],
     ){}
  }