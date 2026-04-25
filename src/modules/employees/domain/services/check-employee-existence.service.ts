import { Inject, Injectable } from '@nestjs/common';
import type { FindActiveEmployeeByEmail } from '../../application/ports/find-active-employee-by-email.port';
import { ExistEmployeeError } from '../errors/exist-employee.error';
import { InactiveEmployeeError } from '../errors/inactive-employee.error';

@Injectable()
export class CheckEmployeeExistenceService {
  constructor(
    @Inject('FIND_ACTIVE_EMPLOYEE_BY_EMAIL')
    private readonly findActiveEmployeeByEmailPort: FindActiveEmployeeByEmail,
  ) {}
  async check(email: string): Promise<Error | null> {
    const existingEmployee =
      await this.findActiveEmployeeByEmailPort.isExist(email);

    if (!existingEmployee) return null;
    if (!existingEmployee.isActive) {
      return new InactiveEmployeeError();
    }
    return new ExistEmployeeError();
  }
}
