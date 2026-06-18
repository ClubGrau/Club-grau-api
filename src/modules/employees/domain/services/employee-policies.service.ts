import { Inject, Injectable } from '@nestjs/common';
import type { FindActiveEmployeeByEmail } from '../../application/ports/find-active-employee-by-email.port';
import { EmployeeNotFoundError } from '../errors/employee-not-found.error';
import { InactiveEmployeeError } from '../errors/inactive-employee.error';
import { EmployeeModel } from '../models/employee';

type EmployeePoliciesError = EmployeeNotFoundError | InactiveEmployeeError;

@Injectable()
export class EmployeePoliciesService {
  constructor(
    @Inject('FIND_ACTIVE_EMPLOYEE_BY_EMAIL')
    private readonly findActiveEmployeeByEmail: FindActiveEmployeeByEmail,
  ) {}

  async checkIsActive(
    email: string,
  ): Promise<EmployeePoliciesError | EmployeeModel.PrimitivesData> {
    const employee = await this.findActiveEmployeeByEmail.isExist(email);

    if (!employee) return new EmployeeNotFoundError();
    if (!employee.isActive) return new InactiveEmployeeError();

    return employee as EmployeeModel.PrimitivesData;
  }
}
