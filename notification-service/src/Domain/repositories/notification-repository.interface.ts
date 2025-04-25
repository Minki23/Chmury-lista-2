import { NotificationInfo } from "../entities/notification-info.entity";

export interface INotificationRepository {
  create(interview: NotificationInfo): Promise<NotificationInfo>;
  findById(id: string): Promise<NotificationInfo | null>;
  delete(id: string): Promise<boolean>;
  getByEmployeeId(id: string): Promise<NotificationInfo[]>;
}
