import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEmployeeRepository } from 'src/Domain/repositories/employee-repository.interface';
import { EmployeeInfo } from 'src/Domain/entities/employee-info.enity';

@Injectable()
export class EmployeeRepository implements IEmployeeRepository {
  private readonly logger = new Logger('EmployeeRepository');
  constructor(
    @InjectModel('Employee') private readonly employeesModel: Model<EmployeeInfo>
  ) {}
  async findByName(employee: string): Promise<EmployeeInfo | null> {
    try {
      const employeeData = await this.employeesModel.findOne({ name: employee }).exec();
      if (!employeeData) {
        this.logger.warn(`Employee with name ${employee} not found`);
        return null;
      }
      this.logger.log(`Employee retrieved: ${JSON.stringify(employeeData)}`);
      return employeeData;
    } catch (error) {
      this.logger.error(`Error finding employee with name ${employee}: ${error.message}`);
      throw error;
    }
  }

  async add(employee: EmployeeInfo): Promise<EmployeeInfo> {
    this.logger.log(`Adding position: ${JSON.stringify(employee)}`);
    const newPosition = new this.employeesModel(employee);
    return await newPosition.save();
  }

  async findByname(employee): Promise<EmployeeInfo | null> {
    const positionData = await this.employeesModel.findOne({ name: employee }).exec();
    if (!positionData) {
      this.logger.error(`Position ${employee} not found`);
      return null;
    }
    this.logger.log(`Position retrieved: ${JSON.stringify(positionData)}`);
    return positionData;
  }

  async delete(position: string): Promise<boolean> {
    const result = await this.employeesModel.deleteOne({ name: position }).exec();
    if (result.deletedCount === 0) {
      this.logger.error(`Position ${position} not found`);
      return false;
    }
    return true;
  }

  async getWithTechnologies(technologies: string[]): Promise<EmployeeInfo[]> {
    try {
      const lowerCaseTechnologies = technologies.map(tech => tech.toLowerCase());
      const employees = await this.employeesModel
        .find({ proficientTechnologies: { $elemMatch: { $in: lowerCaseTechnologies } } })
        .exec();

      if (employees.length === 0) {
        this.logger.warn(`No employees found with matching technologies. Returning random employees.`);
        const randomEmployees = await this.employeesModel.aggregate([{ $sample: { size: 5 } }]).exec();
        return randomEmployees;
      }

      this.logger.log(`Employees retrieved with matching technologies: ${JSON.stringify(employees)}`);
      return employees;
    } catch (error) {
      this.logger.error(`Error retrieving employees with technologies ${technologies}: ${error.message}`);
      throw error;
    }
  }
}
