import { Inject, Injectable } from '@nestjs/common';
import type { FindActiveEmployeeByEmail } from '../../application/ports/find-active-employee-by-email.port';

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
      return new Error('Existent employee is inactive');
    }
    return new Error('Employee already exists');
  }
}
