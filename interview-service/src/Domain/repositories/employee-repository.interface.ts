import { EmployeeInfo } from "../entities/employee-info.enity";

export interface IEmployeeRepository {
  add(employee: EmployeeInfo): Promise<EmployeeInfo>;
  findByName(employee: string): Promise<EmployeeInfo | null> ;
  delete(employee: string): Promise<boolean>;
  getWithTechnologies(technologies: string[]): Promise<EmployeeInfo[]>;
}