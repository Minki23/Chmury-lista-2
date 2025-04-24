import { PositionInfo } from "../entities/positions-info.entity";


export interface IPositionsRepository {
  add(position: PositionInfo): Promise<PositionInfo>;
  findByPosition(position: string): Promise<PositionInfo | null> ;
  delete(position: string): Promise<boolean>;
}