import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { FindActiveEmployeeByEmail } from '../../../application/ports/find-active-employee-by-email.port';
import { EmployeeModel } from '../../../domain/models/employee';
import { CreateEmployeeRepositoryPort } from '../../../application/ports/create-employee.repository.port';
import {
  GetAllOptions,
  GetAllEmployeesResponse,
  GetAllEmployeesRepositoryPort,
} from '../../../application/ports/get-all-employees.repository.port';

@Injectable()
export class EmployeeMongoRepository
  implements
    FindActiveEmployeeByEmail,
    CreateEmployeeRepositoryPort,
    GetAllEmployeesRepositoryPort
{
  constructor(
    @Inject('EMPLOYEE_MODEL')
    private readonly employeeModel: Model<EmployeeModel.PrimitivesData>,
  ) {}

  async isExist(email: string): Promise<EmployeeModel.Status | null> {
    const employee = await this.employeeModel
      .findOne({ email })
      .select({ _id: 1, email: 1, isActive: 1 })
      .lean();

    if (!employee) {
      return null;
    }

    return {
      id: employee._id.toString(),
      email: employee.email,
      isActive: employee.isActive,
    };
  }

  async create(
    employee: EmployeeModel.PrimitivesData,
  ): Promise<EmployeeModel.CreateResponseDto> {
    const { id, ...rest } = employee;
    const createdEmployee = await this.employeeModel.create({
      _id: id,
      ...rest,
    });
    return { id: createdEmployee._id.toString() };
  }

  async getAll(options: GetAllOptions): Promise<GetAllEmployeesResponse> {
    const { page, limit } = options;
    const countEmployees = await this.employeeModel.countDocuments();
    const employees = await this.employeeModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return {
      employees: employees.map((employee) => ({
        id: employee._id.toString(),
        name: employee.name,
        email: employee.email,
        role: employee.role,
        nif: employee.nif,
        isActive: employee.isActive,
        createdAt: employee.createdAt,
        deactivateAt: employee.deactivateAt,
      })),
      total: countEmployees,
    };
  }
}
