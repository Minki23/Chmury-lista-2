import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { AddEmployeeCommand } from './commands/add-employee.command';
import { IEmployeeRepository } from 'src/Domain/repositories/employee-repository.interface';
import { EmployeeInfo } from 'src/Domain/entities/employee-info.enity';


@CommandHandler(AddEmployeeCommand)
export class AddEmployeeHandler implements ICommandHandler<AddEmployeeCommand> {
    private readonly logger = new Logger('AddEmployeeHandler');
    constructor(
        @Inject('IEmployeeRepository')
        private readonly employeeRepository: IEmployeeRepository,
    ) {}

    async execute(command: AddEmployeeCommand): Promise<EmployeeInfo> {
        const {name, position, phone, email, proficientTechnologies } = command;
        const lowerCaseTechnologies = proficientTechnologies.map(tech => tech.toLowerCase());
        const employee = new EmployeeInfo(
            {
                name,
                position,
                phone,
                email,
                proficientTechnologies: lowerCaseTechnologies
            }
        )
        const employeeCreated = this.employeeRepository.add(employee)
        this.logger.log(`Employee with ID: ${employee.id} and Name: ${employee.name} has been added successfully.`);
        return employeeCreated
    }
}
