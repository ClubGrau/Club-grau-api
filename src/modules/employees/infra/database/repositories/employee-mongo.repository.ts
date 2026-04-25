import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { FindActiveEmployeeByEmail } from '../../../application/ports/find-active-employee-by-email.port';
import { EmployeeModel } from '../../../domain/models/employee';
import { CreateEmployeeRepositoryPort } from '../../../application/ports/create-employee.repository.port';

@Injectable()
export class EmployeeMongoRepository
  implements FindActiveEmployeeByEmail, CreateEmployeeRepositoryPort
{
  constructor(
    @Inject('EMPLOYEE_MODEL')
    private readonly employeeModel: Model<EmployeeModel.PrimitiviesData>,
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
    employee: EmployeeModel.PrimitiviesData,
  ): Promise<EmployeeModel.CreateResponseDto> {
    const { id, ...rest } = employee;
    const createdEmployee = await this.employeeModel.create({
      _id: id,
      ...rest,
    });
    return { id: createdEmployee._id.toString() };
  }
}
