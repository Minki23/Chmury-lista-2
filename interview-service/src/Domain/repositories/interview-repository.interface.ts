import { EmployeeInfo } from "../entities/employee-info.enity";
import { InterviewInfo } from "../entities/intreview-info.entity";

export interface IInterviewsRepository {
  create(interview: InterviewInfo): Promise<InterviewInfo>;
  findById(id: string): Promise<InterviewInfo | null>;
  delete(id: string): Promise<boolean>;
  getByEmployeeId(id: string): Promise<InterviewInfo[]>
}