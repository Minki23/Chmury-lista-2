
export class EmployeeInfo {
    id: string;
    name: string;
    position: string;
    phone: string;
    email: string;
    constructor(partial: Partial<EmployeeInfo>) {
        Object.assign(this, partial);
    }
}