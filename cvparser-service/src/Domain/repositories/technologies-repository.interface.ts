import { TechnologiesInfo } from "../entities/technologiesInfo.entity";


export interface ITechnologiesRepository {
  add(technologies: TechnologiesInfo): Promise<TechnologiesInfo>;
  get(): Promise<TechnologiesInfo>;
  delete(technology: string[]): Promise<boolean>;
}