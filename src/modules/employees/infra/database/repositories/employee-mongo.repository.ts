/* eslint-disable @typescript-eslint/require-await */
import { Inject, Injectable } from '@nestjs/common';
import { FindActiveEmployeeByEmail } from '../../../application/ports/find-active-employee-by-email.port';
import { EmployeeModel } from '../../../domain/models/employee';
import { Model } from 'mongoose';
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    employee: EmployeeModel.PrimitiviesData,
  ): Promise<EmployeeModel.CreateResponseDto> {
    throw new Error('Method not implemented.');
  }
}
